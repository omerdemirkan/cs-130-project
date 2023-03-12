import { screen, fireEvent, render, } from '@testing-library/react';
import { CreateDatasetModal } from '../pages/dashboard/datasets/index';
import '@testing-library/jest-dom'

describe('Create Dataset Modal', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn((_: string) => Promise.resolve());

    const renderCreateDatasetModal = (open: boolean) => {
        render(<CreateDatasetModal
            open={open}
            onClose={onClose}
            onSubmit={onSubmit}
            loading={false}
        />);
    }

    it('doesn\'t render when closed and renders when open.', () => {
        renderCreateDatasetModal(false);
        expect(screen.findByRole('dialog')).toEqual(Promise.resolve({}));

        renderCreateDatasetModal(true);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });



    it('changes inputs to be case-insensitive with "-" replacing " ".', () => {        
        renderCreateDatasetModal(true);

        const textbox = screen.getByRole('textbox');
        fireEvent.change(textbox, {target: {value: 'Test Dataset Name'}});
        expect(textbox).toHaveValue('test-dataset-name');
    
    });



    it('it calls close and submit logic once.', async () => {        
        renderCreateDatasetModal(true);

        const button_cancel = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(button_cancel);
        expect(onClose).toHaveBeenCalledTimes(1);

        const button_ok = screen.getByRole('button', { name: /ok/i });
        fireEvent.click(button_ok);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
})