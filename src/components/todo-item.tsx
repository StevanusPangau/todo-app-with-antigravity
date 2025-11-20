'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { toggleTodo, deleteTodo, updateTodo } from '@/app/actions'
import { toast } from 'sonner'

interface TodoItemProps {
    todo: {
        id: string
        content: string
        completed: boolean
        createdAt: Date
    }
}

export function TodoItem({ todo }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(todo.content)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleToggle = async () => {
        try {
            await toggleTodo(todo.id, !todo.completed)
        } catch (error) {
            toast.error('Failed to update todo')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTodo(todo.id)
            toast.success('Todo deleted')
            setShowDeleteDialog(false)
        } catch (error) {
            toast.error('Failed to delete todo')
        }
    }

    const handleUpdate = async () => {
        if (!editValue.trim()) return
        try {
            await updateTodo(todo.id, editValue)
            setIsEditing(false)
            toast.success('Todo updated')
        } catch (error) {
            toast.error('Failed to update todo')
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date))
    }

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                    layout: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                    y: { duration: 0.2 }
                }}
                className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={handleToggle}
                        className="h-5 w-5"
                    />
                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 bg-gray-800/50 border-gray-700 text-white"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdate()
                                    if (e.key === 'Escape') setIsEditing(false)
                                }}
                            />
                            <Button size="icon" variant="ghost" onClick={handleUpdate} className="h-8 w-8 text-green-600">
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8 text-red-600">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1">
                            <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                {todo.content}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                {formatDate(todo.createdAt)}
                            </span>
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-1 ml-2">
                        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 text-blue-600">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setShowDeleteDialog(true)} className="h-8 w-8 text-red-600">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </motion.div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Todo</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus todo ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
