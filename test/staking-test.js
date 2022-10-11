const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers')
const { toBN } = require('web3-utils');
const { toUnit, fastForward } = require('./utils')();
const { assert } = require('./common');
const { time } = require("@nomicfoundation/hardhat-network-helpers");


async function toWei(n) {
  return ethers.utils.parseEther(n);
}

async function toEth(n) {
    return ethers.utils.formatEther(n);
}

describe("Deployments", function () {
  let owner, user1, user2, user3, user4, user5, user6;
  let stakingRewards, reward;
  const DAY = 86400;
  const ZERO_BN = toBN(0);
  const toUnit = v => ethers.utils.parseUnits(v.toString());

  beforeEach(async function () {
    [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();
    const Reward = await ethers.getContractFactory("RewardsToken");
    reward = await Reward.deploy();
    await reward.deployed();

    const Staking = await ethers.getContractFactory("StakingToken");
    staking = await Staking.deploy();
    await staking.deployed();

    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    stakingRewards = await StakingRewards.deploy(reward.address, staking.address);
    await stakingRewards.deployed();

    await reward.transfer(stakingRewards.address, 60000);

    await reward.transfer(user1.address, 10000);
    await reward.transfer(user2.address, 10000);
    await reward.transfer(user3.address, 10000);
    await reward.transfer(user4.address, 10000);
    await staking.transfer(user5.address, 10000);
    await staking.transfer(user6.address, 10000);

    // await reward.transferTokens(stakingRewards.address);
    await reward.connect(user1).approve(stakingRewards.address, 10000);
    await reward.connect(user2).approve(stakingRewards.address, 10000);
    await reward.connect(user3).approve(stakingRewards.address, 10000);
    await reward.connect(user4).approve(stakingRewards.address, 10000);
    await staking.connect(user5).approve(stakingRewards.address, 10000);
    await staking.connect(user6).approve(stakingRewards.address, 10000);
  });

  describe("Check Deployments", function () {
    it("Should be deployed", async function () {
      await reward.deployed();
      await stakingRewards.deployed();
    });

    it("Should deduct the amount of tokens transferred", async function () {
      const balance = await reward.totalSupply();
      const amt = await balance.sub(100000)

      expect(await reward.balanceOf(owner.address)).to.equal(amt.toString());
    });

    it("Should have balance of atleast 1000 for user1", async function () {
      expect(await reward.balanceOf(user1.address)).to.equal(10000);
    });
  });

  describe("Function Stake", function () {
    it("Should fail if deposit amount is equal to zero", async function () {
      await expect(stakingRewards.connect(user1).stake(0)).to.be.revertedWith(
        "Cannot stake 0"
      );
    });

    it('staking increases staking balance', async () => {
			const totalToStake = toUnit('100');
			await staking.transfer(user5.address, totalToStake, { from: owner.address });
      staking.connect(user5).approve(stakingRewards.address, totalToStake)
			const initialStakeBal = await stakingRewards.balanceOf(user5.address);
			const initialLpBal = await staking.balanceOf(user5.address);
			await stakingRewards.connect(user5).stake(totalToStake)

			const postStakeBal = await stakingRewards.balanceOf(user5.address);
			const postLpBal = await staking.balanceOf(user5.address);

			assert.bnLt(postLpBal, initialLpBal);
			assert.bnGt(postStakeBal, initialStakeBal);
		});

    it('cannot stake 0', async () => {
			await assert.revert(stakingRewards.stake('0'), 'Cannot stake 0');
		});
  });

  describe("Function withdraw", function () {
    it("cannot withdraw if nothing staked", async function () {
      await expect(stakingRewards.connect(user1).withdraw(1000)).to.be.reverted;
    });

    it("Should fail if amount is 0", async function () {
      await expect(
        stakingRewards.connect(user1).withdraw(0)
      ).to.be.revertedWith("Cannot withdraw 0");
    });

    it('should increases lp token balance and decreases staking balance', async () => {
			const totalToStake = toUnit('100');
			await staking.transfer(user5.address, totalToStake, { from: owner.address });
      staking.connect(user5).approve(stakingRewards.address, totalToStake)
      await stakingRewards.connect(user5).stake(totalToStake)

			const initialStakingTokenBal = await staking.balanceOf(user5.address);
			const initialStakeBal = await stakingRewards.balanceOf(user5.address);

			await stakingRewards.connect(user5).withdraw(totalToStake);

			const postStakingTokenBal = await staking.balanceOf(user5.address);
			const postStakeBal = await stakingRewards.balanceOf(user5.address);

			assert.bnEqual(postStakeBal.add(totalToStake), initialStakeBal);
			assert.bnEqual(initialStakingTokenBal.add(totalToStake), postStakingTokenBal);
		});
    // });
  });

  describe('exit()', () => {
		it('should retrieve all earned and increase rewards bal', async () => {
			const totalToStake = toUnit('100');
			const totalToDistribute = toUnit('5000');

			await staking.transfer(user5.address, totalToStake, { from: owner.address });
      staking.connect(user5).approve(stakingRewards.address, totalToStake)
      await stakingRewards.connect(user5).stake(totalToStake)
			await reward.transfer(stakingRewards.address, totalToDistribute, { from: owner.address });

      await stakingRewards.connect(user6).notifyRewardAmount(toUnit(5000.0));

      var currentTime = await time.latest()
      await time.increaseTo(currentTime + DAY)

			const initialRewardBal = await reward.balanceOf(user5.address);
			const initialEarnedBal = await stakingRewards.earned(user5.address);
      await stakingRewards.connect(user5).exit()
			const postRewardBal = await reward.balanceOf(user5.address);
			const postEarnedBal = await stakingRewards.earned(user5.address);

			assert.bnLt(postEarnedBal, initialEarnedBal);
			assert.bnGt(postRewardBal, initialRewardBal);
			assert.bnEqual(postEarnedBal, ZERO_BN);
		});
	});
});