'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus, Edit2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const TIMES = ['09:00', '12:00', '17:00', '20:00', '21:00'];
const DAYS_COUNT = 14; // можно больше

export default function Planner() {
  const [days] = useState(() => Array.from({ length: DAYS_COUNT }, (_, i) => addDays(new Date(), i)));
  const [posts, setPosts] = useState<any[]>([]);
  const [teasers, setTeasers] = useState<any[]>([]);

  // Заглушка тизеров (потом заменим на реальный fetch из NocoDB)
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
    // Здесь будет полная логика drag&drop (тизер → слот, перемещение постов)
    console.log('Перетащили:', event);
    // TODO: добавить реальную логику
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">Планировщик постов в Telegram</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-8 max-w-[1900px] mx-auto">
          {/* СЕТКА */}
          <div className="flex-1 overflow-x-auto pb-8">
            <div className="inline-grid grid-cols-[120px_repeat(auto-fit,minmax(160px,1fr))] gap-px bg-zinc-800 p-px rounded-3xl min-w-[1700px]">
              {/* Заголовок "Время" */}
              <div className="bg-zinc-900 p-4 font-medium text-zinc-400 text-sm">Время</div>
              {days.map((day, i) => (
                <div key={i} className="bg-zinc-900 p-4 text-center font-medium">
                  {format(day, 'EEE', { locale: ru })}<br />
                  <span className="text-xs text-zinc-400">{format(day, 'dd.MM')}</span>
                  {i === 0 && <span className="ml-1 text-emerald-400 text-xs">(Сегодня)</span>}
                </div>
              ))}

              {TIMES.map((time, tIdx) => (
                <>
                  <div key={`time-${tIdx}`} className="bg-zinc-900 p-6 flex items-center justify-end text-2xl font-medium border-r border-zinc-700">
                    {time}
                  </div>
                  {days.map((_, dIdx) => (
                    <div
                      key={`${dIdx}-${tIdx}`}
                      className="bg-zinc-900 min-h-[140px] p-4 rounded-2xl border border-dashed border-zinc-700 hover:border-emerald-500 flex items-center justify-center cursor-pointer relative group transition-all"
                      onClick={() => alert('Слот ' + (dIdx + 1) + ' в ' + time)}
                    >
                      <div className="text-center text-zinc-500">
                        <Plus size={32} />
                        <div className="text-xs mt-2">Добавить пост</div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          {/* ГАЛЕРЕЯ ТИЗЕРОВ */}
          <div className="w-80 bg-zinc-900 rounded-3xl p-6 overflow-y-auto max-h-[700px] flex-shrink-0">
            <h2 className="font-bold text-xl mb-6">Галерея тизеров</h2>
            <div className="grid grid-cols-2 gap-4">
              {teasers.map(t => (
                <div
                  key={t.id}
                  className="aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center text-6xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
                >
                  {t.preview}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-8 text-center">Перетаскивай тизеры в слоты слева</p>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
