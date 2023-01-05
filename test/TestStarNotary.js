

const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star and can add the star name and star symbol properly', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, 'AWS', {from: accounts[0]});
    const result = await instance.lookUptokenIdToStarInfo.call(tokenId);
    const resultName = result[0];
    const resultSymbol = result[1];
    // console.log(resultName + '  ' + resultSymbol);

    assert.equal(resultName, 'Awesome Star!');
    assert.equal(resultSymbol, 'AWS');

});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, 'aws', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, 'aws', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, 'aws', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, 'aws', {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

// it('can add the star name and star symbol properly', async() => {
//     // 1. create a Star with different tokenId
//     //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    
//     // Incorporated in first test
// });

it('lets 2 users exchange stars', async() => {
    // create 2 Stars with different tokenId
    // accounts[0] owns tokenId==6 before exchange and accounts[1] owns tokenId2==7
    let tokenId1 = 6;
    let tokenId2 = 7;
    let instance = await StarNotary.deployed();
    await instance.createStar('Star to exchange 1', tokenId1, 'SE1', {from: accounts[0]}); 
    await instance.createStar('Star to exchange 2', tokenId2, 'SE2', {from: accounts[1]});
    // Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(tokenId1, tokenId2);
    // Verify that the owners changed
    // after exchange accounts[0] should own tokenId==7 and accounts[1] should own tokenId==6
    assert.equal(await instance.ownerOf.call(tokenId2), accounts[0]);
    assert.equal(await instance.ownerOf.call(tokenId1), accounts[1]);
     

});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId from accounts[0]
    let tokenId = 8;
    let instance = await StarNotary.deployed();
    await instance.createStar('Star to be transferred', tokenId, 'STR', {from: accounts[0]});
    // 2. use the transferStar function implemented in the Smart Contract to transfer to accounts[1]
    await instance.transferStar(accounts[1], tokenId);
    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(tokenId), accounts[1]);
});

it('lookUptokenIdToStarInfo test', async() => {
   
    // 1. create a Star with different tokenId from accounts[0]
    let tokenId = 9;
    let instance = await StarNotary.deployed();
    await instance.createStar('Star for lookup-test', tokenId, 'SLT', {from: accounts[0]});
    
    //Use the lookUptokenIdToStarInfo
    const result = await instance.lookUptokenIdToStarInfo.call(tokenId);
    const resultName = result[0];
    const resultSymbol = result[1];
    // console.log(resultName + '  ' + resultSymbol);

    assert.equal(resultName, 'Star for lookup-test');
    assert.equal(resultSymbol, 'SLT');

});