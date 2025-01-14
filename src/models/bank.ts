import BankAccount from "@/models/bank-account";
import TransactionService from "@/services/TransactionService";
import { BankAccountId, BankId, UserId } from "@/types/Common";
import User from "@/models/user";

class Bank {
  bankId: BankId;
  // name: string;
  isNegativeAllowed: boolean;

  constructor(options?: { isNegativeAllowed?: boolean }) {
    // this.name = name
    this.bankId = crypto.randomUUID();
    this.isNegativeAllowed = options ? options.isNegativeAllowed : false;
  }

  static create(options?: { isNegativeAllowed?: boolean }): Bank {
    const bank: Bank = new Bank(options);
    return bank;
  }

  getId() {
    return this.bankId;
  }

  createAccount(balance: number) {
    if (!this.isNegativeAllowed && balance < 0) {
      throw new Error("Positive Bank cannot have negative balance");
    }
    const account: BankAccount = BankAccount.create(this.bankId, balance);
    return account;
  }

  getAccount(bankAccountId: BankAccountId) {
    return BankAccount.getAccountFromBankAccountId(bankAccountId);
  }

  send(
    senderId: UserId,
    receiverId: UserId,
    amount: number,
    receiverBankId: BankId = this.bankId
  ) {
    // this.id  // senderBankId
    // this.isNegativeAllowed // senderBankId option

    // sender bank account
    const senderBankAccountIds: BankAccountId[] =
      User.getBankAccountsFromUserId(senderId);
    // select the bank account from the bank where this method is called
    let senderBankAccount: BankAccount;
    for (const bankAccountId of senderBankAccountIds) {
      const bankAccount =
        BankAccount.getAccountFromBankAccountId(bankAccountId);
      if (bankAccount.bankId == this.bankId) {
        if (!this.isNegativeAllowed && bankAccount.balance >= amount) {
          senderBankAccount = bankAccount;
          break;
        } else if (this.isNegativeAllowed) {
          senderBankAccount = bankAccount;
          break;
        }
      }
    }

    if (!senderBankAccount) {
      throw new Error("Insufficient funds");
    }

    // reciever bank account
    const receiverBankAccountIds: BankAccountId[] =
      User.getBankAccountsFromUserId(receiverId);
    let receiverBankAccount: BankAccount;
    for (const bankAccountId of receiverBankAccountIds) {
      const bankAccount =
        BankAccount.getAccountFromBankAccountId(bankAccountId);
      if (bankAccount.bankId == receiverBankId) {
        if (senderId == receiverId && senderBankAccount.getId() == bankAccount.getId()) {
          continue;
        }
        receiverBankAccount = bankAccount;
        break;
      }
    }

    // sending the money
    TransactionService.send(
      senderBankAccount,
      receiverBankAccount,
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
