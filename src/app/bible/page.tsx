'use client';

import { useEffect } from 'react';

export default function BiblePage() {
  useEffect(() => {
    // Replace the entire document with the bible HTML
    fetch('/bible-page.html')
      .then(res => res.text())
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      });
  }, []);

  return null;
}
