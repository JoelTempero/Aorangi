import { Printer } from 'lucide-react'
import { Button } from '../ui'
import { ASSIGNMENT_ROLE_LABELS } from '../../types/schedule.types'

interface PrintScheduleProps {
  sections: { id: string; name: string; description: string }[]
  slots: Record<string, { name: string; time: string; dayTag?: string; timeTag?: string }[]>
  teamMembers: { id: string; displayName: string }[]
  eventName?: string
}

export function PrintScheduleButton({ sections, slots, teamMembers, eventName = 'EC Media 2025' }: PrintScheduleProps) {
  const handlePrint = () => {
    // Open print view in new window
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print the schedule')
      return
    }

    const html = generatePrintHTML(sections, slots, teamMembers, eventName)
    printWindow.document.write(html)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  return (
    <Button
      variant="outline"
      leftIcon={<Printer className="h-4 w-4" />}
      onClick={handlePrint}
    >
      Print
    </Button>
  )
}

function generatePrintHTML(
  sections: { id: string; name: string; description: string }[],
  slots: Record<string, { name: string; time: string; dayTag?: string; timeTag?: string }[]>,
  teamMembers: { id: string; displayName: string }[],
  eventName: string
): string {
  const sectionRows = sections.map(section => {
    const sectionSlots = slots[section.id] || []
    if (sectionSlots.length === 0) return ''

    const slotRows = sectionSlots.map((slot, index) => {
      // Demo assignments for print
      const assignments = teamMembers.slice(0, 3).map((member, i) => ({
        name: member.displayName,
        role: ASSIGNMENT_ROLE_LABELS[['shoot_highlights', 'edit_highlights', 'audio'][i] as keyof typeof ASSIGNMENT_ROLE_LABELS] || 'Team Member'
      }))

      const tags = [slot.dayTag, slot.timeTag].filter(Boolean).join(' - ')

      return `
        <tr>
          <td class="slot-name">
            <span class="slot-type">${slot.name}</span>
            ${tags ? `<span class="slot-tags">${tags}</span>` : ''}
          </td>
          <td class="slot-time">${slot.time}</td>
          <td class="slot-assignments">
            ${assignments.map(a => `<div class="assignment">${a.name} <span class="role">(${a.role})</span></div>`).join('')}
          </td>
        </tr>
      `
    }).join('')

    return `
      <div class="section">
        <h2>${section.name} <span class="section-desc">${section.description}</span></h2>
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Time</th>
              <th>Assignments</th>
            </tr>
          </thead>
          <tbody>
            ${slotRows}
          </tbody>
        </table>
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${eventName} - Schedule</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 5px;
          color: #1a1a1a;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e5e5;
        }

        .header p {
          color: #666;
          font-size: 14px;
        }

        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }

        .section h2 {
          font-size: 16px;
          background: #f5f5f5;
          padding: 10px 15px;
          margin-bottom: 0;
          border: 1px solid #ddd;
          border-bottom: none;
        }

        .section-desc {
          font-weight: normal;
          color: #666;
          font-size: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px 12px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background: #f9f9f9;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .slot-name {
          width: 25%;
        }

        .slot-time {
          width: 20%;
          color: #666;
        }

        .slot-assignments {
          width: 55%;
        }

        .slot-type {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 11px;
          background: #e0f2fe;
          color: #075985;
        }

        .slot-tags {
          display: block;
          font-size: 10px;
          color: #666;
          margin-top: 4px;
        }

        .assignment {
          padding: 3px 0;
        }

        .assignment:not(:last-child) {
          border-bottom: 1px dashed #eee;
        }

        .role {
          color: #888;
          font-size: 11px;
        }

        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #999;
          font-size: 10px;
        }

        @media print {
          body {
            padding: 0;
          }

          .section {
            page-break-inside: avoid;
          }

          h2 {
            page-break-after: avoid;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${eventName}</h1>
        <p>Team Schedule</p>
      </div>

      ${sectionRows}

      <div class="footer">
        Generated on ${new Date().toLocaleDateString()} | Eastercamp Media Team
      </div>
    </body>
    </html>
  `
}
