import { describe, it, expect } from 'vitest';
import { buildMessageFormData } from '../../src/services/message.service';
import type { MessageModel } from '../../src/models/MessageModel';

describe('message.service buildMessageFormData', () => {
  it('serializes basic message fields and recipients', () => {
    const model: MessageModel = {
      id: 15,
      subject: 'Temat testowy',
      body: '<p>Tresc</p>',
      recipients: [{ id: 1, type: 'user', displayName: 'Jan Nowak' }],
      attachments: [],
    };

    const formData = buildMessageFormData(model);

    expect(formData.get('id')).toBe('15');
    expect(formData.get('subject')).toBe('Temat testowy');
    expect(formData.get('body')).toBe('<p>Tresc</p>');
    expect(formData.get('recipients')).toBe(
      JSON.stringify([{ id: 1, type: 'user', displayName: 'Jan Nowak' }])
    );
  });

  it('includes uploaded files under attachments key', () => {
    const file = new File(['abc'], 'a.txt', { type: 'text/plain' });

    const model: MessageModel = {
      subject: 'Temat testowy',
      body: 'Body',
      recipients: [{ id: 2, type: 'user', displayName: 'Anna Kowal' }],
      attachments: [
        {
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          file,
        },
      ],
    };

    const formData = buildMessageFormData(model);

    const uploaded = formData.getAll('attachments');
    expect(uploaded).toHaveLength(1);
    expect(uploaded[0]).toBeInstanceOf(File);
    expect((uploaded[0] as File).name).toBe('a.txt');
  });
});
