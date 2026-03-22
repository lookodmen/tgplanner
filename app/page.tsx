'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus, Edit2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const TIMES = ['09:00', '12:00', '17:00', '20:00', '23:00'];
const DAYS_COUNT = 7; // можно менять

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    console.log('Перетащили:', event);
    // TODO: логика drag&drop
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-center">Планировщик постов в Telegram</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* СЕТКА */}
          <div className="flex-1 overflow-x-auto pb-6 lg:pb-0">
            <div className="inline-grid min-w-[1000px] md:min-w-[1400px] lg:min-w-[1700px] grid-cols-[100px_repeat(7,minmax(140px,1fr))] md:grid-cols-[120px_repeat(7,minmax(160px,1fr))] gap-px bg-zinc-800 p-px rounded-2xl md:rounded-3xl">
              {/* Заголовок "Время" */}
              <div className="bg-zinc-900 p-3 md:p-4 font-medium text-zinc-400 text-xs md:text-sm">Время</div>
              {days.map((day, i) => (
                <div key={i} className="bg-zinc-900 p-3 md:p-4 text-center font-medium text-sm md:text-base">
                  {format(day, 'EEE', { locale: ru })}<br />
                  <span className="text-xs text-zinc-400">{format(day, 'dd.MM')}</span>
                  {i === 0 && <span className="ml-1 text-emerald-400 text-xs">(Сегодня)</span>}
                </div>
              ))}

              {TIMES.map((time, tIdx) => (
                <>
                  <div key={`time-${tIdx}`} className="bg-zinc-900 p-4 md:p-6 flex items-center justify-end text-xl md:text-2xl font-medium border-r border-zinc-700">
                    {time}
                  </div>
                  {days.map((_, dIdx) => (
                    <div
                      key={`${dIdx}-${tIdx}`}
                      className="bg-zinc-900 min-h-[120px] md:min-h-[140px] p-3 md:p-4 rounded-xl md:rounded-2xl border border-dashed border-zinc-700 hover:border-emerald-500 flex items-center justify-center cursor-pointer relative group transition-all"
                    >
                      <div className="text-center text-zinc-500">
                        <Plus size={28} className="mx-auto" />
                        <div className="text-xs mt-2">Добавить пост</div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          {/* ГАЛЕРЕЯ */}
          <div className="w-full lg:w-80 bg-zinc-900 rounded-2xl md:rounded-3xl p-4 md:p-6 overflow-y-auto max-h-[500px] md:max-h-[700px] flex-shrink-0">
            <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-6">Галерея тизеров</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4">
              {teasers.map(t => (
                <div
                  key={t.id}
                  className="aspect-square bg-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center text-4xl md:text-6xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
                >
                  {t.preview}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-6 md:mt-8 text-center">Перетаскивай тизеры в слоты слева</p>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
