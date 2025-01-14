import Bank from "@/models/bank";
import BankAccount from "@/models/bank-account";
import User from "@/models/user";
import { BankAccountId, BankId, UserId } from "@/types/Common";

export default class GlobalRegistry {
  private static users: Map<UserId, User> = new Map();
  private static accounts: Map<BankAccountId, BankAccount> = new Map();
  private static banks: Map<BankId, Bank> = new Map();

  static registerUser(user: User): void {
    this.users.set(user.getId(), user);
  }

  static registerBank(bank: Bank): void {
    this.banks.set(bank.getId(), bank);
  }

  static registerAccount(account: BankAccount): void {
    this.accounts.set(account.getId(), account);
  }

  static GetUser(userId: UserId): User | undefined {
    const user = this.users.get(userId);
    return user;
  }

  static getBank(bankId: BankId): Bank | undefined {
    const bank = this.banks.get(bankId);
    return bank;
  }

  static getAccount(accountId: BankAccountId): BankAccount | undefined {
    const account = this.accounts.get(accountId);
    return account;
  }

  static clear() {
    this.users.clear();
    this.banks.clear();
    this.accounts.clear();
  }
}