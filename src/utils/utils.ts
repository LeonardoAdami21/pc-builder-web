import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge de classes Tailwind com suporte a condicionais */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata número como moeda BRL */
export function formatPrice(value: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

/** Formata desconto percentual */
export function discountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

/** Formata data relativa (ex: "há 3 dias") */
export function relativeDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 30) return `Há ${days} dias`
  if (days < 365) return `Há ${Math.floor(days / 30)} meses`
  return `Há ${Math.floor(days / 365)} anos`
}

/** Trunca string com ellipsis */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

/** Gera iniciais do nome */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/** Debounce para inputs de busca */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}