import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, UserId } from "@/types/Common";
import {v4 as uuidv4} from "uuid";

class User {
  userId: UserId;
  name: string;
  accountsIdArr: BankAccountId[];

  constructor(id: UserId, name: string, accountsIdArr: BankAccountId[]) {
    this.userId = id
    this.name = name;
    this.accountsIdArr = accountsIdArr;
  }

  static create(name: string, accountsIdArr: BankAccountId[]): User {
    const user: User = new this(uuidv4(), name, accountsIdArr);
    GlobalRegistry.registerUser(user);
    return user;
  }

  getId() {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getAccountIds(): BankAccountId[] {
    return this.accountsIdArr;
  }
}

export default User;