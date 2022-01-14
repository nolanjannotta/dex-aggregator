pragma solidity 0.8.6;

import "./interfaces/RouterInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract DexAggregator {
    address WETH;
    address USDC;

    RouterInterface[2] public routers;





    constructor() {
        WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        routers[0] = RouterInterface(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); //UNISWAP
        routers[1] = RouterInterface(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F); //SUSHISWAP



    }

    function wethToUSDC(uint wethAmount) public {
        IERC20 token = IERC20(WETH);

        require(token.transferFrom(msg.sender, address(this), wethAmount), "transferFrom failed");

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDC;

        (uint routerIndex, uint usdcOut) = getHighestAmountOut(path, wethAmount);

        token.approve(address(routers[routerIndex]), wethAmount);

        routers[routerIndex].swapExactTokensForTokens(wethAmount, usdcOut, path, msg.sender, block.timestamp + 5 minutes);

    }

    function usdcToWETH(uint usdcAmount) public {
        IERC20 token = IERC20(USDC);

        require(token.transferFrom(msg.sender, address(this), usdcAmount), "transferFrom failed");

        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;

        (uint routerIndex, uint usdcOut) = getHighestAmountOut(path, usdcAmount);

        token.approve(address(routers[routerIndex]), usdcAmount);

        routers[routerIndex].swapExactTokensForTokens(usdcAmount, usdcOut, path, msg.sender, block.timestamp + 5 minutes);


    }


    function getHighestAmountOut(address[] memory path, uint amountIn) public view returns(uint, uint) {
        
        uint[] memory uni = routers[0].getAmountsOut(amountIn, path);
        uint[] memory sushi = routers[1].getAmountsOut(amountIn, path);

        if (uni[1] > sushi[1]){
            return(0, uni[1]);
        }
        else {
            return(1, sushi[1]);
        }

    }

    function sushiRate(address[] memory path, uint amountIn) public view returns(uint) {
        uint[] memory sushi = routers[1].getAmountsOut(amountIn, path);
        return sushi[1];
    }

    function uniRate(address[] memory path, uint amountIn) public view returns(uint) {
        uint[] memory uni = routers[0].getAmountsOut(amountIn, path);
        return uni[1];

    }














}