// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

abstract contract InitData {

    struct Image {
        string name;
        string avatar;
        string description;
        uint256 amountVote;
    }

    mapping(uint256 => address) public artistId;
    mapping(uint256 => Image) public imageId;

    string public baseURI;

    /**
     * Dummy data for event
     * In the future, we can accept the same from construction,
     * which will be called at the time of deployment
     */
    function _initializeData() internal {

        imageId[1] = Image({
            name: "Beautifull Girl",
            avatar: bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/asset/0x1.jpg")) : "",
            description: "A Beautifull Girl",
            amountVote: 0
        });
        artistId[1] = 0x7e43f90bED8fD75BfF186Ae199c77F8dF55fD898;

        imageId[2] = Image({
            name: "Hot Girl Assassin",
            avatar: bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/asset/0x2.jpg")) : "",
            description: "A Hot Girl Assassin",
            amountVote: 0
        });
        artistId[2] = 0x895d54c0C99de41b31bc9B1e0b4a92Bc3190d256;

        imageId[3] = Image({
            name: "Rabit",
            avatar: bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/asset/0x3.jpg")) : "",
            description: "A rabit",
            amountVote: 0
        });
        artistId[3] = 0xA84937C6F5f6ad83d885E977262d8d7A237D012A;

        imageId[4] = Image({
            name: "The Girl I Like",
            avatar: bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/asset/0x4.jpg")) : "",
            description: "The Girl I Like",
            amountVote: 0
        });
        artistId[4] = 0xb28B3C557a3D0CE38CA0dDfe988ab355473C4130;

        imageId[5] = Image({
            name: "Boom",
            avatar: bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/asset/0x5.jpg")) : "",
            description: "A Boom",
            amountVote: 0
        });
        artistId[5] = 0x9C5232D1db9EAa4B87c8b8D1846A9bBC2A7AF91E;
    }
}