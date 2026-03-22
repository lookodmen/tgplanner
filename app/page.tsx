'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const TIMES = ['09:00', '12:00', '17:00', '20:00', '21:00'];
const DAYS_COUNT = 7; // 7 дней — оптимально

export default function Planner() {
  const [days] = useState(() => Array.from({ length: DAYS_COUNT }, (_, i) => addDays(new Date(), i)));
  const [posts, setPosts] = useState<any[]>([]);
  const [teasers, setTeasers] = useState<any[]>([]);

  useEffect(() => {
    setTeasers(Array.from({ length: 12 }, (_, i) => ({
      id: `teaser-${i}`,
      title: `Тизер ${i + 1}`,
      preview: '🖼️'
    })));
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    console.log('Перетащили:', event);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-10 text-center text-white">
        Планировщик постов в Telegram
      </h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* СЕТКА */}
          <div className="flex-1 overflow-x-auto pb-6 lg:pb-0">
            <div className="inline-grid grid-flow-col gap-px bg-zinc-800 p-px rounded-2xl lg:rounded-3xl">
              {/* Заголовок "Время" */}
              <div className="bg-zinc-900 p-4 font-medium text-zinc-400 text-sm min-w-[100px] lg:min-w-[120px]">
                Время
              </div>

              {days.map((day, i) => (
                <div key={i} className="bg-zinc-900 p-4 text-center font-medium text-base min-w-[140px] lg:min-w-[160px]">
                  {format(day, 'EEE', { locale: ru }).toUpperCase()}<br />
                  <span className="text-xs text-zinc-400">{format(day, 'dd.MM')}</span>
                  {i === 0 && <span className="ml-1 text-emerald-400 text-xs">(Сегодня)</span>}
                </div>
              ))}

              {TIMES.map((time, tIdx) => (
                <>
                  <div key={`time-${tIdx}`} className="bg-zinc-900 p-4 lg:p-6 flex items-center justify-end text-xl lg:text-2xl font-medium border-r border-zinc-700 min-w-[100px] lg:min-w-[120px]">
                    {time}
                  </div>

                  {days.map((_, dIdx) => (
                    <div
                      key={`${dIdx}-${tIdx}`}
                      className="bg-zinc-900 min-h-[120px] lg:min-h-[140px] p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-dashed border-zinc-700 hover:border-emerald-500 flex items-center justify-center cursor-pointer relative group transition-all min-w-[140px] lg:min-w-[160px]"
                    >
                      <div className="text-center text-zinc-500">
                        <Plus size={32} className="mx-auto" />
                        <div className="text-sm mt-2">Добавить пост</div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          {/* ГАЛЕРЕЯ */}
          <div className="w-full lg:w-80 bg-zinc-900 rounded-2xl lg:rounded-3xl p-4 lg:p-6 overflow-y-auto max-h-[400px] lg:max-h-[700px] flex-shrink-0">
            <h2 className="font-bold text-lg lg:text-xl mb-4 lg:mb-6">Галерея тизеров</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:gap-4">
              {teasers.map(t => (
                <div
                  key={t.id}
                  className="aspect-square bg-zinc-800 rounded-xl lg:rounded-2xl flex items-center justify-center text-4xl lg:text-6xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
                >
                  {t.preview}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-6 lg:mt-8 text-center">
              Перетаскивай тизеры в слоты слева
            </p>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
