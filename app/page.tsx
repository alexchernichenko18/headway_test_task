'use client';

import AnswerItem from '@/src/components/ui/AnswerItem/AnswerItem';
import AmountItem from '@/src/components/ui/AmountItem/AmountItem';
import Button from '@/src/components/ui/Button/Button';

export default function Page() {
  return (
    <div
      style={{
        maxWidth: 360,
        margin: '40px auto',
        display: 'grid',
        gap: 12,
      }}
    >
      <Button onClick={() => { }}>Start game</Button>

      <AnswerItem indexCount={0}>Paris</AnswerItem>
      <AnswerItem indexCount={1} state='selected'>
        London
      </AnswerItem>
      <AnswerItem indexCount={2} state='correct'>
        Rome
      </AnswerItem>
      <AnswerItem indexCount={3} state='wrong'>
        Berlin
      </AnswerItem>

      <div style={{
        overflow: 'hidden',
        padding: '0 24px',
        marginTop: 16,
      }}>
        <AmountItem>$1,000,000</AmountItem>
        <AmountItem>$500,000</AmountItem>
        <AmountItem>$250,000</AmountItem>
        <AmountItem>$125,000</AmountItem>
        <AmountItem>$64,000</AmountItem>
        <AmountItem>$32,000</AmountItem>
        <AmountItem>$16,000</AmountItem>
        <AmountItem state='active'>$8,000</AmountItem>
        <AmountItem state='disabled'>$4,000</AmountItem>
        <AmountItem state='disabled'>$2,000</AmountItem>
        <AmountItem state='disabled'>$1,000</AmountItem>
        <AmountItem state='disabled'>$500</AmountItem>
      </div>
    </div>
  );
}