namespace AMS_26967.DTOs;

public record InsertCardDTO(string AccountNumber, string Pin);
public record DepositDTO(decimal Amount);
public record WithdrawDTO(decimal Amount);
public record TransferDTO(string ReceiverAccountNumber, decimal Amount);
public record CreateAccountDTO(string Name, string AccountNumber, string Pin, decimal InitialBalance = 0);
public record ResetPinDTO(string NewPin);
