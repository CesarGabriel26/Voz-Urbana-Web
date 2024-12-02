import React, { useEffect, useState } from "react"
import { PrioritiesColors } from "../utils/consts"
import { formatDate } from "../utils/Parser"
import { Highlight } from 'rsuite';

export const CardStyles = {
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        padding: 16,
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 16,
        borderStyle: 'solid',

        display: 'flex',
        flexDirection: "column"
    },
    colorIndicator: {
        height: 10,
        width: "100%",
        marginBottom: 8,
    },
    level: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
    },
    example: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#555",
    },
}

export default function PriorityCard({ extraButtons = [], noMax = false, searchTerm = "", tittle = "", content = "", date = "", prioridade = 0, onPress, pressableText = "Text", style }) {
    const [textColor, setTextColor] = useState("text-dark")

    useEffect(() => {
        setTextColor(localStorage.getItem('theme') === "light" ? 'text-dark' : 'text-light')
    }, [])

    return (
        <div
            style={{
                ...CardStyles.card,
                borderColor: PrioritiesColors[prioridade],
                ...style,
                maxWidth: noMax ? '' : 500,
            }}
        >
            <div
                style={{ ...CardStyles.colorIndicator, backgroundColor: PrioritiesColors[prioridade] }}
            />

            <div
                style={{
                    minHeight: 120,
                    padding: 10,
                    borderRadius: 10,
                    flex: 1,
                }}
            >
                <Highlight
                    className={`${textColor} bold`}
                    style={CardStyles.level}
                    query={searchTerm}
                >
                    <p>
                        {tittle}
                    </p>
                </Highlight>


                <Highlight
                    className={textColor}
                    query={searchTerm}
                    style={{
                        ...CardStyles.description,
                        width: '100%',
                        overflow: 'hidden',
                        maxHeight: 200,
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        textOverflow: 'ellipsis',
                    }}
                >
                    <p>
                        {content}
                    </p>
                </Highlight>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }} >
                    {
                        date != "" ? (
                            <p
                                className={`${textColor} bold`}
                                style={{
                                    ...CardStyles.example,
                                    flex: 1,
                                }}
                            >
                                {formatDate(date)}
                            </p>
                        ) : null
                    }
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }} >
                        <div
                            className="d-none d-md-flex"
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10
                            }}
                        >
                            {
                                extraButtons.length > 0 ? (
                                    extraButtons.map((btn, i) => (
                                        <a
                                            key={i}
                                            className="a-link"
                                            onClick={btn.onPress}
                                        >
                                            <p
                                                className={`${textColor} bold`}
                                                style={{
                                                    flex: 1,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {btn.pressableText} |
                                            </p>
                                        </a>
                                    ))
                                ) : null
                            }
                        </div>
                        {
                            onPress ? (
                                <a
                                    className="a-link"
                                    onClick={onPress}
                                >
                                    <p
                                        className={`${textColor} bold`}
                                        style={{
                                            flex: 1,
                                            textAlign: 'right',
                                        }}
                                    >
                                        {pressableText}
                                    </p>
                                </a>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}