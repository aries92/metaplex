import { toPublicKey } from '@oyster/common';
import { PublicKey, VoteAccountInfo } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export const useArtist = () => {
  return 'Taras'; //TODO: implement actual owner name getting
};

type VoteAccountInfoWithName = VoteAccountInfo & { name: string };

export const useValidator = ({ connection }): VoteAccountInfoWithName => {
  const [voteAccounts, setVoteAccount] = useState(
    {} as VoteAccountInfoWithName,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voteAccounts = await connection.getVoteAccounts();
        const allAccounts = [
          ...voteAccounts.current,
          ...voteAccounts.delinquent,
        ];
        const requiredValidatorId =
          '9QU2QSxhb24FUX3Tu2FpczXjpK3VYrvRudywSZaM29mF';

        const validator = allAccounts.find(
          account => account.votePubkey === requiredValidatorId,
        );

        setVoteAccount({
          ...validator,
          name: 'Madrid', //TODO: implement actual name getting
        });
      } catch (e) {
        console.error(e);
      }
    };
    if (connection) {
      fetchData();
    }
  }, [connection]);

  return voteAccounts;
};

export const useValidatorBalance = ({ connection, validator }) => {
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await connection.getBalance(
          toPublicKey(validator.nodePubkey) as unknown as PublicKey,
        );
        setBalance(Math.round(balance / 10000000));
      } catch (e) {
        console.error(e);
      }
    };
    if (validator && connection) {
      fetchData();
    }
  }, [connection, validator]);

  return balance;
};
