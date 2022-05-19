import * as React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { Dimensions } from '../../types';
import { getTimeStamp } from '../../utils/getTimeStamp';
import { ChatAttachments } from '../../stories/Atoms/Attachments/Attachments';
import {
  ChatCard as Card,
  ChatContainer,
  RepliedToContainer,
} from '../../stories/Atoms/Chat';
import { LinkPreview } from '../../stories/Atoms/Chat/LinkPreview/LinkPreview';
import { ChatMenu } from '../../stories/Atoms/Chat/Menu/Menu';
import { CheckBox } from '../../stories/Atoms/Check';
import { DefaultStyleWrapper } from '../../stories/Atoms/DefaultStyleWrapper';
import { Link } from '../../stories/Atoms/Link';
import { Text } from '../../stories/Atoms/Text/Text';

export type ChatCardType = {
  /**
   * attachment link list
   */
  attachmentsLinks: string[];
  /**
   * attachment mime list
   */
  attachmentsMime: string[];
  /**
   * attachment name list
   */
  attachmentsName: string[];
  /**
   * message type, C/I/D/V
   */
  chatType: string;
  /**
   * message slected?
   */
  checked: boolean;
  /**
   * link image
   */
  extractedImage: string;
  /**
   * link title
   */
  extractedTitle: string;
  /**
   * single chat delete handler
   */
  handleDelete: () => void;
  /**
   * single chat share handler
   */
  handleShare: () => void;
  /**
   * is the message selected
   */
  isForwarded: boolean;
  /**
   * does the message contain a link
   */
  isLink: boolean;
  /**
   * is the message replied to
   */
  isReplied: boolean;
  /**
   * is the user sender
   */
  isUserSender: boolean;
  /**
   * link
   */
  link: string;
  /**
   * message body
   */
  message: React.ReactNode | string | null | undefined;
  /**
   * attachment previews
   */
  previews?: string[];
  /**
   * reply from contact
   */
  replyFrom: string | null | undefined;
  /**
   * reply message
   */
  replyMessage: string | null | undefined;
  /**
   * sender name
   */
  senderName: string;
  /**
   * message source app
   */
  source: string;
  /**
   * set single chat data for share/delete of a single card
   */
  setChatData: () => void;
  /**
   * toggle handler for select
   */
  toggleHandler: () => void;
  /**
   * timestamp
   */
  unix: number;
  /**
   * dimensions list
   */
  dimensions: Dimensions[];
};

const ContentBody = styled(Text)`
  word-break: break-word;
  ${tw`break-words`}
`;

export const ChatCard: React.ForwardRefExoticComponent<
  ChatCardType & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(
  (
    {
      attachmentsLinks,
      attachmentsMime,
      attachmentsName,
      checked,
      extractedImage,
      extractedTitle,
      handleDelete,
      handleShare,
      isForwarded,
      isLink,
      isReplied,
      isUserSender,
      link,
      message,
      previews,
      replyFrom,
      replyMessage,
      senderName,
      setChatData,
      source,
      toggleHandler,
      unix,
      dimensions,
    },
    ref
  ) => {
    return (
      <ChatContainer
        ref={ref}
        sender={isUserSender}
        fullWidth={attachmentsLinks.length > 1}
        left={
          <CheckBox size='small' checked={checked} onChange={toggleHandler} />
        }
        right={
          <Card
            left={
              <>
                {!isUserSender && <Text bold>{senderName}</Text>}
                {isForwarded && (
                  <Text bold color='emerald'>
                    Forwarded
                  </Text>
                )}
                {isReplied && (
                  <RepliedToContainer>
                    {replyFrom ? <Text bold>{replyFrom}</Text> : <div />}
                    <Text as='span'>{replyMessage}</Text>
                  </RepliedToContainer>
                )}
                {isLink &&
                  (extractedImage || extractedTitle ? (
                    <LinkPreview
                      link={link}
                      src={extractedImage}
                      title={extractedTitle}
                    />
                  ) : (
                    <ContentBody>
                      <Link href={link}>{link}</Link>
                    </ContentBody>
                  ))}
                {message && (
                  <ContentBody>
                    <DefaultStyleWrapper>{message}</DefaultStyleWrapper>
                  </ContentBody>
                )}
                {!isLink && attachmentsLinks.length > 0 && (
                  <ChatAttachments
                    attachmentsLinks={attachmentsLinks}
                    attachmentsMime={attachmentsMime}
                    attachmentsName={attachmentsName}
                    previews={previews}
                    source={source}
                    unix={unix}
                    dimensions={dimensions}
                  />
                )}
              </>
            }
            right={
              <>
                <Text size='xs'>{getTimeStamp(unix)}</Text>
                <ChatMenu
                  handleDelete={() => {
                    setChatData();
                    handleDelete();
                  }}
                  handleShare={() => {
                    setChatData();
                    handleShare();
                  }}
                />
              </>
            }
          />
        }
      />
    );
  }
);
