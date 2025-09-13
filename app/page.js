'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Home() {
  const [loading, setLoading] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [dateFilter, setDateFilter] = useState('PreviousMonth')

  const handleLogin = () => {
    if (username === 'trs' && password === 'admin11') {
      setIsAuthenticated(true)
      setShowLogin(false)
    } else {
      setError('Invalid username or password')
    }
  }

  const handleDownload = async (endpoint, filename, reportType) => {
    setLoading(reportType)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/${endpoint}?date_filter=${dateFilter}`,
        { method: 'POST' }
      )

      if (!response.ok) {
        throw new Error('Failed to generate the report')
      }

      const contentDisposition = response.headers.get('Content-Disposition')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      if (contentDisposition?.includes('filename=')) {
        const extractedFilename = contentDisposition.split('filename=')[1].trim()
        a.download = extractedFilename.replace(/['"]/g, '')
      } else {
        a.download = filename
      }

      a.href = url
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-[url('/bg.jpg')] bg-[size:100%_100%] bg-no-repeat bg-center pt-32">
      {!isAuthenticated ? (
        <Dialog open={showLogin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleLogin} className="w-full">Login</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Card className="w-full max-w-md h-[550px] flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Automated Report Generator</CardTitle>
            <CardDescription className="text-center">Generate and download financial reports with ease</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select onValueChange={(value) => setDateFilter(value)} value={dateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Date Filter" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem  value="Today">Today</SelectItem>
               <SelectItem value="Yesterday">Yesterday</SelectItem>
                <SelectItem value="ThisWeek">This Week</SelectItem>
                <SelectItem value="ThisMonth">This Month</SelectItem>
                <SelectItem value="ThisQuarter">This Quarter</SelectItem>
                <SelectItem value="ThisYear">This Year</SelectItem>
         
                <SelectItem value="PreviousWeek">Previous Week</SelectItem>
                <SelectItem value="PreviousMonth">Previous Month</SelectItem>
                <SelectItem value="PreviousQuarter">Previous Quarter</SelectItem>
                <SelectItem value="PreviousYear">Previous Year</SelectItem>

             

              </SelectContent>
            </Select>

            <ReportButton
              title="Work In Progress"
              description="Download the Profit and Loss statement"
              onClick={() => console.log('TODO: implement P&L report')}
              loading={loading === 'P&L'}
            />
            <ReportButton
              title="Receivables Report"
              description="Process and download the Receivables report"
              onClick={() => handleDownload('process_and_download', `receivables__${dateFilter}`, 'Receivables')}
              loading={loading === 'Receivables'}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">© 2023 Your Company Name. All rights reserved.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function ReportButton({ title, description, onClick, loading }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Button onClick={onClick} disabled={loading} variant="outline" className="w-32">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating
          </>
        ) : (
          <>
            <FileDown className="mr-2 h-4 w-4" />
            Download
          </>
        )}
      </Button>
    </div>
  )
}
