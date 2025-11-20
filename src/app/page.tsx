import { getTodos, addTodo } from './actions'
import { TodoItem } from '@/components/todo-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import LiquidEther from '@/components/LiquidEther'
import { AnimatePresence } from 'framer-motion'

export default async function Home() {
    const todos = await getTodos()

    async function handleAdd(formData: FormData) {
        'use server'
        const content = formData.get('content') as string
        if (!content?.trim()) return
        await addTodo(content)
    }

    return (
        <div className="min-h-screen relative py-10 px-4">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                />
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">My Tasks</h1>
                    <p className="text-white/90">Stay organized and get things done.</p>
                </div>

                <Card className="border-none shadow-lg bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Add New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={handleAdd} className="flex gap-4">
                            <Input
                                name="content"
                                placeholder="What needs to be done?"
                                className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                                required
                            />
                            <Button type="submit">Add Task</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <div className="text-center py-10 text-white/90 bg-gray-900/50 backdrop-blur-sm rounded-lg">
                            No tasks yet. Add one above!
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {todos.map((todo) => (
                                <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
            <Toaster />
        </div>
    )
}
