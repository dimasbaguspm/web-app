import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import {
  Button,
  ButtonGroup,
  Calendar,
  Icon,
  Modal,
} from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarCogIcon, FilterIcon } from 'lucide-react';
import { FC, useState } from 'react';

interface ActionsControlProps {
  date: Dayjs;
  onFilterClick: () => void;
  onDateChange: (date: Dayjs) => void;
}

export const ActionsControl: FC<ActionsControlProps> = ({
  date,
  onFilterClick,
  onDateChange,
}) => {
  const { isDesktop } = useWindowResize();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<Dayjs>(date);

  const handleOnCalendarClick = () => {
    setIsModalOpen(true);
  };

  const handleOnCalendarConfirm = () => {
    onDateChange(tempDate);
    setIsModalOpen(false);
  };

  const handleOnCalendarCancel = () => {
    setTempDate(date);
    setIsModalOpen(false);
  };

  return (
    <>
      <ButtonGroup alignment="between" className="mb-4">
        <Button variant="outline" onClick={onFilterClick}>
          <Icon as={FilterIcon} size="sm" color="gray" />
          Filter
        </Button>
        <Button variant="outline" onClick={handleOnCalendarClick}>
          <Icon as={CalendarCogIcon} size="sm" color="gray" />
          Calendar
        </Button>
      </ButtonGroup>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        placement={isDesktop ? 'center' : 'top'}
      >
        <Modal.Body className="px-4">
          <Calendar
            type="single"
            value={tempDate.toDate()}
            onChange={(date) => setTempDate(dayjs(date as Date))}
          />
        </Modal.Body>
        <Modal.Footer className="px-4">
          <ButtonGroup alignment="end">
            <Button variant="ghost" onClick={handleOnCalendarCancel}>
              Cancel
            </Button>
            <Button onClick={handleOnCalendarConfirm}>Confirm</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};
