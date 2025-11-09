"use client"

import { useState, useMemo } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import EmailIcon from "@/components/icons/email"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import QuestionCard from "@/components/sandbox/question-card"
import TopicFilter from "@/components/sandbox/topic-filter"
import DifficultyFilter from "@/components/sandbox/difficulty-filter"
import QuestionDetailModal from "@/components/sandbox/question-detail-modal"
import { DSA_QUESTIONS, TOPICS, type DSAQuestion } from "@/lib/dsa-questions"

export default function SandboxPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredQuestions = useMemo(() => {
    return DSA_QUESTIONS.filter((q) => {
      const matchesTopic = selectedTopic === "All Topics" || q.topic === selectedTopic
      const matchesDifficulty = selectedDifficulty === null || q.difficulty === selectedDifficulty
      return matchesTopic && matchesDifficulty
    })
  }, [selectedTopic, selectedDifficulty])

  const stats = useMemo(() => {
    const solved = DSA_QUESTIONS.filter((q) => q.solved).length
    const totalXp = DSA_QUESTIONS.filter((q) => q.solved).reduce((sum, q) => sum + q.xp, 0)
    const easy = DSA_QUESTIONS.filter((q) => q.difficulty === "Easy").length
    const medium = DSA_QUESTIONS.filter((q) => q.difficulty === "Medium").length
    const hard = DSA_QUESTIONS.filter((q) => q.difficulty === "Hard").length
    const easySolved = DSA_QUESTIONS.filter((q) => q.difficulty === "Easy" && q.solved).length
    const mediumSolved = DSA_QUESTIONS.filter((q) => q.difficulty === "Medium" && q.solved).length
    const hardSolved = DSA_QUESTIONS.filter((q) => q.difficulty === "Hard" && q.solved).length

    return {
      solved,
      total: DSA_QUESTIONS.length,
      totalXp,
      easy,
      medium,
      hard,
      easySolved,
      mediumSolved,
      hardSolved,
    }
  }, [])

  const handleViewDetails = (question: DSAQuestion) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Sandbox",
        description: "Master Data Structures & Algorithms with curated challenges",
        icon: EmailIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="space-y-4">
          <TopicFilter selectedTopic={selectedTopic} topics={TOPICS} onSelectTopic={setSelectedTopic} />
          <DifficultyFilter selectedDifficulty={selectedDifficulty} onSelectDifficulty={setSelectedDifficulty} />

          {/* Statistics Card */}
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Overall Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-3">
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Total Solved</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.solved}/{stats.total}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">XP Earned</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalXp}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Progress</p>
                <div className="w-full h-2 bg-background rounded overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(stats.solved / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Difficulty Distribution */}
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-background rounded">
                  <p className="text-xs text-green-400 uppercase font-bold mb-2">Easy</p>
                  <p className="text-2xl font-bold">
                    {stats.easySolved}/{stats.easy}
                  </p>
                  <div className="h-1.5 bg-foreground/10 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(stats.easySolved / stats.easy) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-xs text-yellow-400 uppercase font-bold mb-2">Medium</p>
                  <p className="text-2xl font-bold">
                    {stats.mediumSolved}/{stats.medium}
                  </p>
                  <div className="h-1.5 bg-foreground/10 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${(stats.mediumSolved / stats.medium) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-3 bg-background rounded">
                  <p className="text-xs text-red-400 uppercase font-bold mb-2">Hard</p>
                  <p className="text-2xl font-bold">
                    {stats.hardSolved}/{stats.hard}
                  </p>
                  <div className="h-1.5 bg-foreground/10 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(stats.hardSolved / stats.hard) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div>
            <h3 className="text-xs font-bold uppercase text-foreground/60 mb-3">
              Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""} • {selectedTopic}
            </h3>
            <div className="space-y-3">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} onViewDetails={handleViewDetails} />
                ))
              ) : (
                <Card className="ring-2 ring-pop">
                  <CardContent className="bg-accent py-8 text-center">
                    <p className="text-foreground/60">No questions found. Try a different filter.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Detail Modal */}
      <QuestionDetailModal question={selectedQuestion} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardPageLayout>
  )
}
