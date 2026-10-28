import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQ_ITEMS, type FaqItem } from '@/demo/faq'

interface FaqAccordionProps {
  items?: FaqItem[]
  limit?: number
}

export function FaqAccordion({ items = FAQ_ITEMS, limit }: FaqAccordionProps) {
  const list = limit ? items.slice(0, limit) : items

  return (
    <Accordion type="single" collapsible className="w-full">
      {list.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
