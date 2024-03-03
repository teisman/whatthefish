# whatthefish

A browser extension that produces recognizable password fields for trusted and untrusted domains in a fight against phishing.

Users can mark websites as trusted. Password fields in trusted websites receive a unique background style, distinct from the background style of password fields in untrusted websites. The idea is that when seeing the untrusted pattern in a website you frequently visit, you should get alarmed and make sure that you're not being phished.

The designs for trusted and untrusted password fields are unique per user, but can be overridden in the setting page to suit your needs. The reason we generate unique backgrounds for safe and unsafe domains at first use of the extension is that we explicitly don't want to use the same safe/unsafe styles for all users. If we'd use the same safe/unsafe style for all our users, phising websites would apply the safe style themselves.

