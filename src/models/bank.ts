import BankAccount from "@/models/bank-account";
import TransactionService from "@/services/TransactionService";
import { BankAccountId, BankId, UserId } from "@/types/Common";
import User from "@/models/user";
import { v4 as uuidv4 } from "uuid";
import GlobalRegistry from "@/services/GlobalRegistry";
import { aK } from "vitest/dist/chunks/reporters.D7Jzd9GS";

class Bank {
  bankId: BankId;
  accounts: Map<BankAccountId, BankAccount>;
  isNegativeAllowed: boolean;

  constructor(id: BankId, isNegativeAllowed: boolean = false) {
    this.bankId = id
    this.accounts = new Map();
    this.isNegativeAllowed = isNegativeAllowed;
  }

  static create(options?: { isNegativeAllowed?: boolean }): Bank {
    const bank: Bank = new this(uuidv4(), options?.isNegativeAllowed || false);
    GlobalRegistry.registerBank(bank);
    return bank;
  }

  getId(): BankId {
    return this.bankId;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = BankAccount.create(initialBalance, this.bankId);
    this.accounts.set(account.getId(), account);
    return account;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account =
      this.accounts.get(accountId) || GlobalRegistry.getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  getIsNegativeAllowed(): boolean {
    return this.isNegativeAllowed;
  }

  hasAccount(accountId: string): boolean {
    return this.accounts.has(accountId);
  }

  send(
    senderId: UserId,
    receiverId: UserId,
    amount: number,
    receiverBankId: BankId = this.bankId
  ): void {
    const senderUser = GlobalRegistry.GetUser(senderId);
    const recieverUser = GlobalRegistry.GetUser(receiverId);

    const senderAccountIds = senderUser.getAccountIds()
    const senderAccounts = [];
    for (const senderAccountId of senderAccountIds) {
      const account = this.accounts.get(senderAccountId);
      if (account !== undefined) {
        senderAccounts.push(account);
      }
    }

    let totalBalance = 0;
    for (const account of senderAccounts) {
      totalBalance += account.getBalance();
    }

    if (!this.isNegativeAllowed && totalBalance < amount) {
      throw new Error("Insufficient funds");
    }

    let receiverAccount: BankAccount;
    if (receiverBankId && receiverBankId !== this.bankId) {
      const receiverBank = GlobalRegistry.getBank(receiverBankId);
      const receiverAccountId = recieverUser
      .getAccountIds()
      .find((id) => receiverBank.accounts.has(id));
      if (!receiverAccountId) {
        throw new Error("Account not found");
      }
      receiverAccount = receiverBank.getAccount(receiverAccountId);
    } else {
      const receiverAccountId = recieverUser
      .getAccountIds()
      .find((id) => this.accounts.has(id));
      if (!receiverAccountId) {
        throw new Error("Account not found")
      }
      receiverAccount = this.getAccount(receiverAccountId);
    }

    // sending the money
    TransactionService.send(
      senderAccounts,
      receiverAccount,
      amount,
      this.isNegativeAllowed
    );
  }
}

export default Bank;

// const bank = Bank.create();
// const johnAccount = bank.createAccount(1000);
// console.log("initial johnbalance-0", johnAccount.balance);
// const johnAccount1 = bank.createAccount(1200);
// console.log("initial johnbalance-1", johnAccount.balance);
// const jayAccount = bank.createAccount(100);

// const john = User.create("John", [johnAccount.getId(), johnAccount1.getId()]);
// const jay = User.create("Jay", [jayAccount.getId()]);

// bank.send(john.getId(), jay.getId(), 1100);
