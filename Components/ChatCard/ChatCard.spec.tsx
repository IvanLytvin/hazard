import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import parse from 'html-react-parser';
import * as React from 'react';

import { useQueryParams } from '../../utils/hooks/useQueryParams';
import { ChatCard } from './ChatCard';

jest.mock('../../utils/hooks/useQueryParams');

const commonData = {
  attachmentsLinks: [],
  attachmentsMime: [],
  attachmentsName: [],
  chatType: 'c',
  checked: false,
  extractedImage: '',
  extractedTitle: '',
  isForwarded: false,
  isLink: false,
  isReplied: false,
  isUserSender: false,
  link: '',
  message: '',
  previews: [],
  replyFrom: null,
  replyMessage: null,
  senderName: '',
  source: 'whatsapp',
  toggleHandler: () => {},
  unix: 123,
  dimensions: [],
  handleDelete: () => {},
  handleShare: () => {},
  setChatData: () => {},
};

describe('Chats Card', () => {
  beforeEach(() => {
    (useQueryParams as jest.Mock).mockReturnValue(['', '']);
  });

  describe('sender name', () => {
    it('no sender', () => {
      const message = {
        message: 'Hi!',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.queryByText('Lorem')).not.toBeInTheDocument();
    });

    it('sent by someone', async () => {
      const message = {
        message: 'Hi!',
        isUserSender: false,
        senderName: 'Lorem',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByText('Lorem')).toBeInTheDocument();
    });

    it("I'm the sender", async () => {
      const message = {
        message: 'Hi!',
        isUserSender: true,
        senderName: 'You',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.queryByText('You')).not.toBeInTheDocument();
    });
  });

  it('forwarded message', async () => {
    const message = {
      message: 'Hi!',
      isForwarded: true,
    };

    render(<ChatCard {...{ ...commonData, ...message }} />);

    expect(screen.getByText(/forwarded/i)).toBeInTheDocument();
  });

  describe('reply message', () => {
    it('missing sender', async () => {
      const message = {
        message: 'Hi!',
        isReplied: true,
        replyMessage: 'Reply !!',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByLabelText(/reply to context/i)).toBeInTheDocument();
    });

    it('with sender', async () => {
      const message = {
        message: 'Hi!',
        isReplied: true,
        replyFrom: 'Lorem',
        replyMessage: 'Reply !!',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByLabelText(/reply to context/i)).toBeInTheDocument();
      expect(screen.getByText(/lorem/i)).toBeInTheDocument();
      expect(screen.getByText('Reply !!')).toBeInTheDocument();
    });
  });

  describe('attachments', () => {
    it('images', () => {
      const message = {
        attachmentsLinks: ['my-link.com', 'my-link-1.com'],
        chatType: 'I',
        attachmentsName: ['my-image', 'my-image'],
        attachmentsMime: ['png', 'png'],
        message: 'Hi',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.queryAllByRole('img')).toHaveLength(2);
    });

    it('video', () => {
      const message = {
        attachmentsLinks: ['my-link.com'],
        chatType: 'I',
        attachmentsName: ['my-video'],
        attachmentsMime: ['mp4'],
        message: 'Hi',
      };

      const { container } = render(
        <ChatCard {...{ ...commonData, ...message }} />
      );

      expect(container.querySelectorAll('video')).toHaveLength(1);
    });

    it('pdf', () => {
      const message = {
        attachmentsLinks: ['my-link.com'],
        chatType: 'I',
        attachmentsName: ['my-pdf.pdf'],
        attachmentsMime: ['pdf'],
        message: 'Hi',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByText('my-pdf.pdf')).toBeInTheDocument();
    });

    it('attachments with previews', () => {
      const message = {
        attachmentsLinks: [
          'my-link.com',
          's3://location/1',
          's3://location/2',
          's3://location/3',
        ],
        chatType: 'I',
        attachmentsName: ['my-pdf.pdf', 'test.jpeg', 'test.xls', 'test.docx'],
        attachmentsMime: ['pdf', 'jpeg', 'xls', 'docx'],
        previews: ['s3://preview/1', null, 's3://preview/2', null],
        message: 'Hi',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByRole('img', { name: 'my-pdf.pdf' })).toHaveAttribute(
        'src',
        's3://preview/1'
      );
      expect(screen.getByRole('img', { name: 'test.jpeg' })).toHaveAttribute(
        'src',
        's3://location/1'
      );
      expect(screen.getByRole('img', { name: 'test.xls' })).toHaveAttribute(
        'src',
        's3://preview/2'
      );
      expect(screen.getByLabelText(/file of type docx/i)).toBeInTheDocument();
    });

    describe('deleted attachments', () => {
      it('image deleted', () => {
        const message = {
          attachmentsLinks: ['my-link.com', 'DELETED'],
          chatType: 'I',
          attachmentsName: ['my-image', 'my-image-2'],
          attachmentsMime: ['png', 'png'],
          message: 'Hi',
        };

        render(<ChatCard {...{ ...commonData, ...message }} />);

        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.queryByText('my-image-2')).not.toBeInTheDocument();
        expect(screen.getAllByLabelText(/deleted/i)).toHaveLength(1);
      });

      it('video deleted', () => {
        const message = {
          attachmentsLinks: ['my-link.com', 'DELETED'],
          chatType: 'I',
          attachmentsName: ['my-video', 'my-video-2'],
          attachmentsMime: ['mp4', 'mp4'],
          message: 'Hi',
        };

        const { container } = render(
          <ChatCard {...{ ...commonData, ...message }} />
        );
        expect(container.querySelectorAll('video')).toHaveLength(1);
        expect(screen.queryByText('my-video-2')).not.toBeInTheDocument();
        expect(screen.getAllByLabelText(/deleted/i)).toHaveLength(1);
      });

      it('pdf deleted', () => {
        const message = {
          attachmentsLinks: ['DELETED'],
          chatType: 'I',
          attachmentsName: ['my-pdf.pdf'],
          attachmentsMime: ['pdf'],
          message: 'Hi',
        };

        render(<ChatCard {...{ ...commonData, ...message }} />);

        expect(screen.queryByText('my-pdf.pdf')).not.toBeInTheDocument();
        expect(screen.getAllByLabelText(/deleted/i)).toHaveLength(1);
      });
    });
  });

  it('message sent in plain_text key', () => {
    const message = {
      message: 'Text testing 1 2 3',
    };

    render(<ChatCard {...{ ...commonData, ...message }} />);

    expect(screen.getByText('Text testing 1 2 3')).toBeInTheDocument();
  });

  it("message sent in message key and plain_text dosen't exist ", () => {
    const message = {
      message: parse('<div>Text 1 2 3 4</div>'),
      timestamp: 1594029060,
    };

    render(<ChatCard {...{ ...commonData, ...message }} />);

    expect(screen.getByText('Text 1 2 3 4')).toBeInTheDocument();
  });

  it('checkbox', () => {
    const toggle = jest.fn();

    const message = {
      message: 'Hi',
      toggleHandler: toggle,
    };

    const { rerender } = render(
      <ChatCard {...{ ...commonData, ...message }} />
    );
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).not.toBeChecked();

    userEvent.click(checkBox);

    expect(toggle).toBeCalled();

    rerender(<ChatCard {...{ ...commonData, ...message, checked: true }} />);

    expect(checkBox).toBeChecked();
  });

  describe('telegram', () => {
    it('message with tag like data', () => {
      const message = {
        message: 'Hi! <hello.world>, <lorem>',
        source: 'telegram',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(
        screen.getByText('Hi! <hello.world>, <lorem>')
      ).toBeInTheDocument();
    });
  });

  describe('messages with links', () => {
    it('with preview image and text', () => {
      const message = {
        extractedImage: 'https://test.com/i.png',
        extractedTitle: 'Test preview',
        isLink: true,
        link: 'https://test.com/',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://test.com/'
      );
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://test.com/i.png'
      );
      expect(screen.getByText('Test preview')).toBeInTheDocument();
    });

    it('with only preview image', () => {
      const message = {
        extractedImage: 'https://test.com/i.png',
        extractedTitle: undefined,
        isLink: true,
        link: 'https://test.com/',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://test.com/'
      );
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://test.com/i.png'
      );
      expect(screen.queryByText('Test preview')).not.toBeInTheDocument();
    });

    it('with only preview text', () => {
      const message = {
        extractedImage: undefined,
        extractedTitle: 'Test preview',
        isLink: true,
        link: 'https://test.com/',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://test.com/'
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('Test preview')).toBeInTheDocument();
    });

    it('with no preview data', () => {
      const message = {
        extractedImage: undefined,
        extractedTitle: undefined,
        isLink: true,
        link: 'https://test.com/',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);

      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://test.com/'
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('with corrupted preview image', () => {
      const message = {
        extractedImage: 'http://test.com/i.png',
        extractedTitle: undefined,
        isLink: true,
        link: 'https://test.com/',
      };

      render(<ChatCard {...{ ...commonData, ...message }} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('card actions', () => {
    it('card share', async () => {
      const message = {
        message: 'Hi!',
      };
      const setChatData = jest.fn();
      const shareHandler = jest.fn();

      render(
        <ChatCard
          {...{
            ...commonData,
            ...message,
            handleShare: shareHandler,
            setChatData: () => setChatData({ doc_id: '123' }),
          }}
        />
      );

      userEvent.click(screen.getByLabelText('overflow menu'));

      await waitFor(
        () => expect(screen.queryByText(/share/i)).toBeInTheDocument(),
        { timeout: 5000 }
      );

      userEvent.click(screen.getByText(/share/i));

      expect(setChatData).toHaveBeenCalledWith({ doc_id: '123' });
      expect(shareHandler).toHaveBeenCalled();
    });

    it('card delete', async () => {
      const message = {
        message: 'Hi!',
      };
      const setChatData = jest.fn();
      const deleteHandler = jest.fn();

      render(
        <ChatCard
          {...{
            ...commonData,
            ...message,
            handleDelete: deleteHandler,
            setChatData: () => setChatData({ doc_id: '123' }),
          }}
        />
      );

      userEvent.click(screen.getByLabelText('overflow menu'));

      await waitFor(
        () => expect(screen.queryByText(/delete/i)).toBeInTheDocument(),
        { timeout: 5000 }
      );

      userEvent.click(screen.getByText(/delete/i));

      expect(setChatData).toHaveBeenCalledWith({ doc_id: '123' });
      expect(deleteHandler).toHaveBeenCalled();
    });
  });
});
