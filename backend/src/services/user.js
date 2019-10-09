exports.senderSignupCodeVerify = code => {
  // sender signup code verification
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const secret = date.getTime() * process.env.SENDER_REGISTRY_SECRET_MUL;
  return secret === +code; // convert to number type then compare
};
