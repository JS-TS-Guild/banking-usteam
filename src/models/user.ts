import { BankAccountId, UserId } from "@/types/Common";

class User {
  userId: UserId;
  name: string;
  accountsIdArr: BankAccountId[];
  static userIdBankAccountIdMap: Map<UserId, BankAccountId[]> = new Map();

  constructor(name: string, accountsIdArr: BankAccountId[]) {
    this.userId = crypto.randomUUID(); // userId
    this.name = name;
    this.accountsIdArr = accountsIdArr;
    User.userIdBankAccountIdMap.set(this.userId, accountsIdArr);
  }

  static create(name: string, accountsIdArr: BankAccountId[]) {
    const user: User = new User(name, accountsIdArr);
    return user;
  }

  getId() {
    return this.userId;
  }

  static getBankAccountsFromUserId(userId: UserId) {
    return User.userIdBankAccountIdMap.get(userId);
  }
}

export default User;
