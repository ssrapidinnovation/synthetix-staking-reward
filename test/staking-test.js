const { expect } = require("chai");
const { ethers } = require("hardhat");
const {BigNumber} = require('ethers')
const { toBN } = require('web3-utils');
const { currentTime, toUnit, fastForward } = require('./utils')();
const { assert } = require('./common');

async function toWei(n) {
  return ethers.utils.parseEther(n);
}

async function toEth(n) {
    return ethers.utils.formatEther(n);
}

// const toUnit = amount => toBN(toWei(amount.toString(), 'ether'));

describe("Deployments", function () {
  let owner, user1, user2, user3, user4, user5, user6;
  let stakingRewards, reward;
  const DAY = 86400;

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
    await staking.transfer(user5.address, 100000000);
    await staking.transfer(user6.address, 10000);

    // await reward.transferTokens(stakingRewards.address);
    await reward.connect(user1).approve(stakingRewards.address, 10000);
    await reward.connect(user2).approve(stakingRewards.address, 10000);
    await reward.connect(user3).approve(stakingRewards.address, 10000);
    await reward.connect(user4).approve(stakingRewards.address, 10000);
    await staking.connect(user5).approve(stakingRewards.address, 100000000);
    await staking.connect(user6).approve(stakingRewards.address, 10000);
  });

  xdescribe("Check Deployments", function () {
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

  xdescribe("Function Stake", function () {
    it("Should fail if deposit amount is equal to zero", async function () {
      await expect(stakingRewards.connect(user1).stake(0)).to.be.revertedWith(
        "Cannot stake 0"
      );
    });
    it("Should update the totalSupply and balances of user on deposit", async function () {
      await stakingRewards.connect(user1).stake(1000);
      expect(await reward.balanceOf(user1.address)).to.equal(9000);
    });
    it("Should transfer tokens to correct address on deposit", async function () {
      await stakingRewards.connect(user1).stake(1000);
      expect(await reward.balanceOf(stakingRewards.address)).to.equal(61000);
    });
    it("Should update the mapping balances", async function () {
      await stakingRewards.connect(user1).stake(1000);
      expect(await stakingRewards.balanceOf(user1.address)).to.equal(1000);
    });
  });

  xdescribe("Function withdraw", function () {
    it("cannot withdraw if nothing staked", async function () {
      await expect(stakingRewards.connect(user1).withdraw(1000)).to.be.reverted;
    });
    it("Should fail if amount is 0", async function () {
      await expect(
        stakingRewards.connect(user1).withdraw(0)
      ).to.be.revertedWith("Cannot withdraw 0");
    });
    it("Should decrease the amount of tokens from totalSupply", async function () {
      await stakingRewards.connect(user1).stake(1000);
      expect(await stakingRewards.totalSupply()).to.equal(1000);
      await stakingRewards.connect(user1).withdraw(500);
      expect(await reward.balanceOf(user1.address)).to.equal(9500);
      expect(await stakingRewards.totalSupply()).to.equal(500);
    });
  });

  describe('exit()', () => {
		it('should retrieve all earned and increase rewards bal', async () => {
      const toUnit = v => ethers.utils.parseUnits(v.toString());
			const totalToStake = toUnit('100');
			const totalToDistribute = toUnit('5000');

			await staking.transfer(user5.address, totalToStake, { from: owner.address });
      staking.connect(user5).approve(stakingRewards.address, totalToStake)
			// await staking.approve(stakingRewards.address, totalToStake, { from: user5.address });
			// await stakingRewards.stake(totalToStake, { from: user5 });
      await stakingRewards.connect(user5).stake(totalToStake)
			await reward.transfer(stakingRewards.address, totalToDistribute, { from: owner.address });

      await fastForward(DAY);
			const initialRewardBal = await reward.balanceOf(user5.address);
			const initialEarnedBal = await stakingRewards.earned(user5.address);
			// await stakingRewards.exit({ from: user5 });
      await stakingRewards.connect(user5).exit()
			const postRewardBal = await reward.balanceOf(user5.address);
			const postEarnedBal = await stakingRewards.earned(user5.address);

			assert.bnLt(postEarnedBal, initialEarnedBal);
			assert.bnGt(postRewardBal, initialRewardBal);
			assert.bnEqual(postEarnedBal, ZERO_BN);
		});
	});

  xdescribe("exit()", () => {
    it("should retrieve all earned and increase rewards bal", async function () {
      const toUnit = v => ethers.utils.parseUnits(v.toString());
      const totalToStake = toUnit('100000');
      const totalToDistribute = toUnit('500000');
      await staking.transfer(user5.address, totalToStake, {
        from: owner.address,
      });
      await staking.approve(stakingRewards.address, totalToStake, {
        from: owner.address,
      });
      stakingRewards.connect(user5).stake(totalToStake)
      await reward.transfer(stakingRewards.address, totalToDistribute, {
        from: owner.address,
      });

      const initialRewardBal = await reward.balanceOf(user5.address);
      const initialEarnedBal = await stakingRewards.earned(user5.address);
      stakingRewards.connect(user5).exit()
      // await stakingRewards.exit({ from: user5.address });
      const postRewardBal = await reward.balanceOf(user5.address);
      const postEarnedBal = await stakingRewards.earned(user5.address);

      console.log(postEarnedBal)
      console.log(initialEarnedBal)
      console.log(postRewardBal)
      console.log(initialRewardBal)
      assert.bnGt(postRewardBal, initialRewardBal);
      assert.bnEqual(postEarnedBal, ZERO_BN);
    });
  });

  xdescribe("earned()", function () {
    it("should be 0 when not staking", async function () {
      assert.bnEqual(await stakingRewards.earned(stakingAccount1), ZERO_BN);
    });

    it("should be > 0 when staking", async () => {
      const totalToStake = toUnit("100");
      await stakingToken.transfer(stakingAccount1, totalToStake);
      await stakingToken
        .connect(user1)
        .approve(stakingRewards.address, totalToStake);
      await stakingRewards.connect(user1).stake(totalToStake);

      const rewardValue = toUnit(5000.0);
      await rewardsToken.transfer(stakingRewards.address, rewardValue);
      await stakingRewards.notifyRewardAmount(rewardValue);

      await fastForward(DAY);

      const earned = await stakingRewards.earned(stakingAccount1);

      assert.bnGt(earned, ZERO_BN);
    });

    it("rewardRate should increase if new rewards come before DURATION ends", async function () {
      const totalToDistribute = toUnit("5000");

      await rewardsToken.transfer(stakingRewards.address, totalToDistribute);
      await stakingRewards.notifyRewardAmount(totalToDistribute);

      const rewardRateInitial = await stakingRewards.rewardRate();

      await rewardsToken.transfer(stakingRewards.address, totalToDistribute);
      await stakingRewards.notifyRewardAmount(totalToDistribute);

      const rewardRateLater = await stakingRewards.rewardRate();

      assert.bnGt(rewardRateInitial, ZERO_BN);
      assert.bnGt(rewardRateLater, rewardRateInitial);
    });

    it("rewards token balance should rollover after DURATION", async function () {
      const totalToStake = toUnit("100");
      const totalToDistribute = toUnit("5000");

      await stakingToken.transfer(stakingAccount1, totalToStake);
      await stakingToken
        .connect(user1)
        .approve(stakingRewards.address, totalToStake);
      await stakingRewards.stake(totalToStake, { from: stakingAccount1 });

      await rewardsToken.transfer(stakingRewards.address, totalToDistribute);
      await stakingRewards.notifyRewardAmount(totalToDistribute);

      await fastForward(DAY * 7);
      const earnedFirst = await stakingRewards.earned(stakingAccount1);

      await setRewardsTokenExchangeRate();
      await rewardsToken.transfer(stakingRewards.address, totalToDistribute);
      await stakingRewards.notifyRewardAmount(totalToDistribute);

      await fastForward(DAY * 7);
      const earnedSecond = await stakingRewards.earned(stakingAccount1);

      assert.bnEqual(earnedSecond, earnedFirst.add(earnedFirst));
    });
  });
});