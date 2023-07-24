// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TBPToken is ERC20, Ownable {
    constructor() ERC20("THE BEST PHOTOGRAHPY", "TBP") {}

    function mint(address to, uint256 amount) public onlyOwner {
        super._mint(to, amount);
    }
}