import axios from "axios";

class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.PHONE_NUMBER_ID || "";
    this.baseUrl = `https://graph.facebook.com/v22.0/${this.phoneNumberId}`;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async markAsRead(messageId: string) {
    try {
      await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        },
        { headers: this.getHeaders() }
      );
    } catch (error: unknown) {
      console.error(
        "Error marking message as read:",
        error
      );
    }
  }

  async sendTextMessage(to: string, text: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: text,
          },
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        "Error sending text message:",
        error
      );
      throw error;
    }
  }

  async sendInteractiveButtons(
    to: string,
    header: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ) {
    try {
      const formattedButtons = buttons.map((btn) => ({
        type: "reply",
        reply: {
          id: btn.id,
          title: btn.title,
        },
      }));

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "interactive",
          interactive: {
            type: "button",
            header: header ? { type: "text", text: header } : undefined,
            body: { text: bodyText },
            action: {
              buttons: formattedButtons,
            },
          },
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        "Error sending interactive buttons:",
        error
      );
      throw error;
    }
  }
}

export const whatsappService = new WhatsAppService();
