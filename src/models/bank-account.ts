import { BankAccountId, BankId } from "@/types/Common";

class BankAccount {
  bankAccountId: string;
  bankId: BankId;
  balance: number;
  private static accountIdMap: Map<BankAccountId, BankAccount> = new Map();

  constructor(bankId: BankId, balance: number) {
    this.bankAccountId = crypto.randomUUID();
    this.bankId = bankId;
    this.balance = balance;
  }

  static create(bankId: BankId, balance: number) {
    const bankAccount = new BankAccount(bankId, balance);
    BankAccount.accountIdMap.set(bankAccount.getId(), bankAccount);
    return bankAccount;
  }

  getId() {
    return this.bankAccountId;
  }

  getBalance() {
    return this.balance;
  }

  static getAccountFromBankAccountId(bankAccountId: BankAccountId) {
    return BankAccount.accountIdMap.get(bankAccountId);
  }
}

export default BankAccount;
