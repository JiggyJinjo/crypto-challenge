CREATE OR REPLACE FUNCTION transfer_funds(senderId UUID, recipientId UUID, transferAmount NUMERIC(15,5)) RETURNS VOID AS $$
DECLARE
    senderBalance NUMERIC(15,5);
BEGIN
    -- Check if the sender has sufficient balance
    SELECT balance INTO senderBalance FROM users WHERE id = senderId;
    IF senderBalance < transferAmount THEN
        RAISE EXCEPTION 'Insufficient funds for transfer';
    END IF;

    -- Deduct amount from sender
    UPDATE users SET balance = balance - transferAmount WHERE id = senderId;

    -- Add amount to recipient
    UPDATE users SET balance = balance + transferAmount WHERE id = recipientId;

    -- Record the transaction
    INSERT INTO transactions (amount, recipient_id, sender_id) VALUES (transferAmount, recipientId, senderId);
END;
$$ LANGUAGE plpgsql;
