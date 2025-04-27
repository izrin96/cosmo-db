import { Transfer } from "./model";
import { Fields, Log, Transaction } from "./processor";
import { addr } from "./util";
import { BlockData } from "@subsquid/evm-processor";
import * as ABI_OBJEKT from "./abi/objekt";
import * as ABI_COMO from "./abi/como";
import { Addresses } from "./constants";
import { randomUUID } from "crypto";

const transferability = ABI_OBJEKT.functions.batchUpdateObjektTransferability;

/**
 * Parse incoming blocks.
 */
export function parseBlocks(blocks: BlockData<Fields>[]) {
  const logs = blocks.flatMap((block) => block.logs);
  const transactions = blocks.flatMap((block) => block.transactions);

  return {
    // objekt transfers
    transfers: logs
      .map(parseTransferEvent)
      .filter((e) => e !== undefined)
      .map((event) => {
        return new Transfer({
          id: randomUUID(),
          from: event.from,
          to: event.to,
          timestamp: new Date(event.timestamp),
          tokenId: event.tokenId,
          hash: event.hash,
        });
      }),

    // objekt transferability updates
    transferability: transactions
      .filter(
        (tx) =>
          !!tx.to &&
          Addresses.OBJEKT === addr(tx.to) &&
          tx.sighash === transferability.sighash
      )
      .flatMap(parseTransferabilityUpdate)
      .filter((e) => e !== undefined),

    // como balance updates
    comoBalanceUpdates: logs
      .filter((log) => addr(Addresses.COMO) === addr(log.address))
      .flatMap(parseComoBalanceEvents),
  };
}

export type TransferEvent = {
  hash: string;
  contract: string;
  from: string;
  to: string;
  tokenId: string;
  timestamp: number;
};

/**
 * Parse a log into a Transfer.
 */
export function parseTransferEvent(log: Log): TransferEvent | undefined {
  try {
    if (log.topics[0] === ABI_OBJEKT.events.Transfer.topic) {
      const event = ABI_OBJEKT.events.Transfer.decode(log);
      return {
        hash: log.transactionHash,
        from: addr(event.from),
        to: addr(event.to),
        contract: addr(log.address),
        tokenId: event.tokenId.toString(),
        timestamp: log.block.timestamp,
      };
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
}

export type TransferabilityUpdate = {
  tokenId: string;
  transferable: boolean;
};

/**
 * Parse an event into an objekt update.
 */
export function parseTransferabilityUpdate(
  tx: Transaction
): TransferabilityUpdate[] {
  try {
    const { tokenIds, transferable } = transferability.decode(tx.input);

    return tokenIds.map((tokenId) => ({
      tokenId: tokenId.toString(),
      transferable: transferable,
    }));
  } catch (err) {
    return [];
  }
}

export type ComoBalanceEvent = {
  hash: string;
  tokenId: number;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
};

/**
 * Parse a log into ComoBalanceEvents.
 */
export function parseComoBalanceEvents(log: Log): ComoBalanceEvent[] {
  try {
    switch (log.topics[0]) {
      // handle single token transfers
      case ABI_COMO.events.TransferSingle.topic: {
        const event = ABI_COMO.events.TransferSingle.decode(log);
        return [
          {
            hash: log.transactionHash,
            from: addr(event.from),
            to: addr(event.to),
            tokenId: Number(event.id),
            value: event.value,
            timestamp: log.block.timestamp,
          },
        ];
      }
      // handle batch token transfers
      case ABI_COMO.events.TransferBatch.topic: {
        const event = ABI_COMO.events.TransferBatch.decode(log);
        const events: ComoBalanceEvent[] = [];

        for (let i = 0; i < event.ids.length; i++) {
          events.push({
            hash: log.transactionHash,
            from: addr(event.from),
            to: addr(event.to),
            tokenId: Number(event.ids[i]),
            value: event.values[i],
            timestamp: log.block.timestamp,
          });
        }
        return events;
      }
      // ?
      default:
        return [];
    }
  } catch (err) {
    return [];
  }
}
