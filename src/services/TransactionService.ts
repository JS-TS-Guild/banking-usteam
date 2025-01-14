import BankAccount from "@/models/bank-account";

class TransactionService {
    static send(senderBankAccount: BankAccount, receiverBankAccount: BankAccount, amount: number, isNegativeAllowed?: boolean) {
        let senderBalance = senderBankAccount.getBalance();
        let receiverBalance = receiverBankAccount.getBalance();

        if (senderBalance >= amount) {
            senderBalance -= amount;
            senderBankAccount.balance = senderBalance
            receiverBalance += amount;
            receiverBankAccount.balance = receiverBalance
        }
        else {
            if (isNegativeAllowed) {
                senderBalance -= amount;
                senderBankAccount.balance = senderBalance
                receiverBalance += amount;
                receiverBankAccount.balance = receiverBalance
            }
            else {
                throw new Error("Insufficient funds");
            }
        }
    }
}

export default TransactionService;