import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import { ChatCard, ChatCardType } from './ChatCard';

export default {
  title: 'Needl/Chat Card',
  component: ChatCard,
} as Meta;

const Template: Story<ChatCardType> = (args) => <ChatCard {...args} />;

export const JustText = Template.bind({});
JustText.args = {
  attachmentsLinks: [],
  attachmentsMime: [],
  attachmentsName: [],
  chatType: 'C',
  isForwarded: false,
  isReplied: false,
  isUserSender: false,
  message: 'Hello',
  previews: [],
  replyFrom: null,
  replyMessage: null,
  senderName: 'Foo',
  source: 'whatsapp',
  unix: new Date().getTime() / 1000,
};

export const LongText = Template.bind({});
LongText.args = {
  ...JustText.args,
  message:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, atque voluptas saepe voluptates doloribus dolorum iste temporibus ducimus ipsa, distinctio dolores a enim dignissimos nisi placeat omnis velit odit? Minima voluptates pariatur qui blanditiis dignissimos molestias neque illum quisquam recusandae at amet, enim earum nihil? Voluptatibus, numquam. Sint, nostrum! Magni?',
};

export const UserIsSender = Template.bind({});
UserIsSender.args = {
  ...LongText.args,
  isUserSender: true,
};

export const IsForwarded = Template.bind({});
IsForwarded.args = {
  ...JustText.args,
  message:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex expedita, nisi inventore dolores facere animi dignissimos porro neque aliquid iste.',
  isForwarded: true,
};

export const IsRepliedTo = Template.bind({});
IsRepliedTo.args = {
  ...IsForwarded.args,
  isForwarded: false,
  isReplied: true,
  replyFrom: 'Bar',
  replyMessage:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, omnis?',
};

export const WithAttachment = Template.bind({});
WithAttachment.args = {
  ...JustText.args,
  chatType: 'M',
  attachmentsLinks: ['https://needl-assets.s3.amazonaws.com/gradient.jpeg'],
  attachmentsMime: ['jpeg'],
  attachmentsName: ['test.jpeg'],
};

export const WithAttachments = Template.bind({});
WithAttachments.args = {
  ...JustText.args,
  chatType: 'M',
  attachmentsLinks: [
    'https://needl-assets.s3.amazonaws.com/gradient.jpeg',
    'https://needl-assets.s3.amazonaws.com/gradient.jpeg',
    'https://needl-assets.s3.amazonaws.com/8fde191453c84cf9add9886c163ad00d',
    'deleted',
  ],
  attachmentsMime: ['jpeg', 'pdf', 'mp4', 'png'],
  attachmentsName: ['test.jpeg', 'test.pdf', 'test.mp4', 'test.png'],
};

export const WithLotsOfAttachments = Template.bind({});
WithLotsOfAttachments.args = {
  ...JustText.args,
  chatType: 'M',
  attachmentsLinks: Array.from({ length: 25 }).fill(
    'https://needl-assets.s3.amazonaws.com/gradient.jpeg'
  ),
  attachmentsMime: Array.from({ length: 25 }).fill('jpeg'),
  attachmentsName: Array.from({ length: 25 }).fill('test.jpeg'),
};

export const SmallTextWithLink = Template.bind({});
SmallTextWithLink.args = {
  ...JustText.args,
  isLink: true,
  link: 'https://reactjs.org',
  extractedImage: 'https://i.ytimg.com/vi/Q92WWJt2wsk/maxresdefault.jpg',
  extractedTitle: 'Lifecycle Methods in React JS | React Basics',
};

export const LongTextWithLink = Template.bind({});
LongTextWithLink.args = {
  ...SmallTextWithLink.args,
  ...LongText.args,
};

export const LinkWithNoPreview = Template.bind({});
LinkWithNoPreview.args = {
  ...SmallTextWithLink.args,
  extractedImage: undefined,
  extractedTitle: undefined,
};
