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
    receiverBankId?: BankId
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
        senderBankAccount = bankAccount;
        break;
      }
    }
    // reciever bank account
    const receiverBankAccountIds: BankAccountId[] =
      User.getBankAccountsFromUserId(receiverId);
    let receiverBankAccount: BankAccount;
    if (receiverBankId) {
      for (const bankAccountId of receiverBankAccountIds) {
        const bankAccount =
          BankAccount.getAccountFromBankAccountId(bankAccountId);
        if (bankAccount.bankId == receiverBankId) {
          receiverBankAccount = bankAccount;
          break;
        }
      }
    } else {
      receiverBankAccount = BankAccount.getAccountFromBankAccountId(
        receiverBankAccountIds[0]
      );
    }
    
    // sending the money
    TransactionService.send(senderBankAccount, receiverBankAccount, amount, this.isNegativeAllowed);
  }
}

export default Bank;
