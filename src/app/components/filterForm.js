import React, { useEffect, useState } from 'react';
import { IoFilterOutline } from "react-icons/io5";
import { Input, } from 'rsuite';
import Modal from 'react-modal';

export default function FilterForm(searchTerm, handleSearch) {
    const [modalIsOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'space-evenly'}} >
                <Input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Pesquisar reclamações..."
                />
                <button
                    style={{
                        height: 30,
                        width: 30
                    }}
                    onClick={() => {
                        setIsOpen(true)
                    }}
                >
                    <IoFilterOutline />
                </button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={() => {
                    setIsOpen(false)
                }}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
                contentLabel="Example Modal"
            >
                <h2 >Hello</h2>
                <button onClick={() => {
                    setIsOpen(false)
                }}>
                    close
                </button>
                <div>I am a modal</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
        </div>
    )
}