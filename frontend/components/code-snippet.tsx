"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const snippets = [
  {
    language: "JavaScript",
    code: `// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
  },
  {
    language: "Python",
    code: `# Quick sort implementation
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
  },
  {
    language: "React",
    code: `// Custom React Hook for localStorage
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}`,
  },
  {
    language: "CSS",
    code: `/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

body, h1, h2, h3, h4, p, figure, blockquote, dl, dd {
  margin: 0;
}

html:focus-within {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

img, picture {
  max-width: 100%;
  display: block;
}`,
  },
  {
    language: "SQL",
    code: `-- Common Table Expression (CTE) example
WITH ranked_products AS (
  SELECT 
    product_id,
    product_name,
    category,
    price,
    ROW_NUMBER() OVER (
      PARTITION BY category 
      ORDER BY price DESC
    ) as price_rank
  FROM products
)
SELECT * FROM ranked_products
WHERE price_rank <= 3;`,
  },
]

export function CodeSnippet() {
  const [snippet, setSnippet] = useState(snippets[0])
  const [copied, setCopied] = useState(false)

  const getRandomSnippet = () => {
    const currentIndex = snippets.findIndex((s) => s.language === snippet.language)
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * snippets.length)
    } while (newIndex === currentIndex && snippets.length > 1)

    setSnippet(snippets[newIndex])
  }

  useEffect(() => {
    getRandomSnippet()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(snippet.code)
      .then(() => {
        setCopied(true)
        toast({
          title: "Copied to clipboard",
          description: `${snippet.language} snippet copied!`,
        })
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{snippet.language}</div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="sr-only">Copy</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={getRandomSnippet}>
            <RefreshCw size={14} />
            <span className="sr-only">New Snippet</span>
          </Button>
        </div>
      </div>

      <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md overflow-x-auto text-xs md:text-sm">
        <code>{snippet.code}</code>
      </pre>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={getRandomSnippet}>
          <RefreshCw size={14} className="mr-1" />
          New Snippet
        </Button>
      </div>
    </div>
  )
}

