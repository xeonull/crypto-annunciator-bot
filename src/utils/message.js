import { saveToSession, deleteFromSession } from "./session.js";

/* Saving message to the session */
export function saveMessageForDelete(ctx, message) {
  saveToSession(ctx, "message_for_remove", message.message_id);
}

/* Deleting message from chat and the session */
export function deleteSavedMessage(ctx, only_from_session = false) {
  if (ctx.session.message_for_remove) {
    if (!only_from_session) ctx.deleteMessage(ctx.session.message_for_remove);
    deleteFromSession(ctx, "message_for_remove");
  }
}
