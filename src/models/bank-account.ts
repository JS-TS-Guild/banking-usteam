import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, BankId } from "@/types/Common";
import { v4 as uuidv4 } from "uuid";

class BankAccount {
  bankAccountId: BankAccountId;
  bankId: BankId;
  balance: number;

  constructor(bankAccountId: BankAccountId, bankId: BankId, balance: number) {
    this.bankAccountId = bankAccountId;
    this.bankId = bankId;
    this.balance = balance;
  }

  static create(balance: number, bankId: BankId): BankAccount {
    const bankAccount = new this(uuidv4(), bankId, balance);
    GlobalRegistry.registerAccount(bankAccount);
    return bankAccount;
  }

  getId(): BankAccountId {
    return this.bankAccountId;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  setBalance(amount: number): void {
    this.balance = amount;
  }

  deposit(amount: number): void {
    this.balance += amount
  }

  withdraw(amount: number): void {
    this.balance -= amount
  }
}

export default BankAccount;
