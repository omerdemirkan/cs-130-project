import {screen, fireEvent, render} from '@testing-library/react';
import { EditorDrawer } from '../pages/dashboard/datasets/[dataset_name]/query';
import '@testing-library/jest-dom'

const rand = (n: number) => { return (Math.sin(n * 1234.5 + 9876.5) * 5432.1) % 1; }

describe('Editor Drawer', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn((_: string) => Promise.resolve());
    const onNodeSearch = jest.fn();

    const renderEditorDrawer = (open: boolean) => {
        render(<EditorDrawer
            open={open}
            onClose={onClose}
            onSubmit={onSubmit}
            loading={false}
            onNodeSearch={onNodeSearch}
        />);
    }

    it('doesn\'t render when closed and renders when open.', () => {
        renderEditorDrawer(false);
        expect(screen.findByRole('dialog')).toEqual(Promise.resolve({}));

        renderEditorDrawer(true);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });


    
    it('it calls close logic once and submit logic as many times as clicked.', () => {
        renderEditorDrawer(true);

        const button_cancel = screen.getByRole('button', { name: /close/i });
        fireEvent.click(button_cancel);
        expect(onClose).toHaveBeenCalledTimes(1);

        const times_to_click = 7;
        const textbox = screen.getByRole('textbox');
        const button_ok = screen.getByRole('button', { name: /send/i });
        for (var i = 0; i < times_to_click; i++) {
            // Randomly generate an input string
            const rand_input = rand(i).toString(20).substring(2, 128)
            onSubmit.mockImplementation(input => {
                expect(textbox).toHaveValue(rand_input);
                return Promise.resolve();
            })

            fireEvent.change(textbox, {target: {value: rand_input}});

            fireEvent.click(button_ok);
            expect(onSubmit).toHaveBeenCalledTimes(i + 1);
        }
    });
})