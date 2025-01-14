import BankAccount from "@/models/bank-account";

class TransactionService {
    static send(
        senderAccounts: BankAccount[],
        receiverAccount: BankAccount,
        amount: number,
        isNegativeAllowed: boolean
    ): void {
        let remainingAmount = amount;
        for (const senderAccount of senderAccounts) {
            const availableBalance = senderAccount.getBalance();
            if (availableBalance > 0) {
                const transferAmount = Math.min(availableBalance, remainingAmount);
                senderAccount.withdraw(transferAmount);
                remainingAmount -= transferAmount;

                if (remainingAmount <= 0) {
                    break;
                }
            }
        }

        if (remainingAmount > 0) {
            if (isNegativeAllowed) {
                senderAccounts[0].withdraw(remainingAmount);
            } else {
                throw new Error("Insufficient funds");
            }
        }

        receiverAccount.deposit(amount);
    }
}

export default TransactionService;