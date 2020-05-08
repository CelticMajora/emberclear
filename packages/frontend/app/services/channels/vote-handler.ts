import Service, { inject as service } from '@ember/service';
import Message from 'emberclear/models/message';
import StoreService from '@ember-data/store';
import VoteVerifier from './vote-verifier';
import FindOrCreateChannelModelService from './find-or-create';
import VoteChain from 'emberclear/models/vote-chain';
import { identityEquals } from 'emberclear/utils/identity-comparison';
import Channel from 'emberclear/models/channel';

export default class ReceivedChannelVoteHandler extends Service {
  @service store!: StoreService;
  @service('channels/vote-verifier') voteVerifier!: VoteVerifier;
  @service('channels/find-or-create') findOrCreator!: FindOrCreateChannelModelService;

  public async handleChannelVote(message: Message, raw: StandardMessage) {
    let existingChannel = await this.findOrCreator.findOrCreateChannel(raw.channelInfo);
    if (existingChannel?.members.contains(message.sender!)) {
      let sentVote = message.metadata as StandardVote;
      let existingVote = await this.findOrCreator.findOrCreateVote(sentVote);

      if (existingVote !== undefined) {
        let voteChain = await this.findOrCreator.findOrCreateVoteChain(sentVote.voteChain);

        // when the sender tries to vote for somebody else or vote is invalid
        if (
          sentVote.voteChain.key.id !== raw.sender.uid ||
          !this.voteVerifier.isValid(voteChain!) ||
          this.isAnActiveVote(existingChannel, voteChain!)
        ) {
          return message;
        }

        // when it is a new vote, add this to the channel votes
        if (!existingChannel.activeVotes.find((vote) => vote.id === existingVote!.id)) {
          existingChannel.activeVotes.push(existingVote);
          existingChannel.save();
        }

        // when this is not a new vote, overwrite existing vote entry
        if (existingVote.voteChain.id !== voteChain!.id) {
          existingVote.voteChain = voteChain!;
        }
        existingVote.save();
      }
    }
    return message;
  }

  private isAnActiveVote(channel: Channel, voteChain: VoteChain): boolean {
    return channel.activeVotes
      .toArray()
      .some(
        (activeVote) =>
          identityEquals(activeVote.voteChain.target, voteChain.target) &&
          activeVote.voteChain.action === voteChain.action
      );
  }
}

declare module '@ember/service' {
  interface Registry {
    'channels/vote-handler': ReceivedChannelVoteHandler;
  }
}
