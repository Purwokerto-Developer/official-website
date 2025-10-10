import React from 'react';
import { DetailEventHeader } from './detail-event-hrader';
import { DetailEventJoin } from './detail-event-join';

const DetailEventContent = () => {
  return (
    <div className="container mx-auto flex flex-col gap-8 py-8">
      <DetailEventHeader />
      <DetailEventJoin />
    </div>
  );
};

export default DetailEventContent;
