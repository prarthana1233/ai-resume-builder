import { useRef, useEffect, useState } from 'react';
import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  resume: ResumeData;
  template?: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
};

const isSchoolLevel = (degree: string) => {
  const lower = degree?.toLowerCase() || '';
  return lower.includes('10th') || lower.includes('sslc') ||
    lower.includes('12th') || lower.includes('puc') ||
    lower.includes('pu') || lower.includes('hsc') ||
    lower.includes('secondary') || lower.includes('high school');
};

function ClassicTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <>
      <header className="text-center border-b-2 border-black pb-3 mb-3">
        <h1 style={{ fontSize: `${fontSize * 1.6}px`, lineHeight: 1.2 }} className="font-bold mb-1 uppercase tracking-wide">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5" style={{ fontSize: `${fontSize * 0.88}px` }}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <><span>•</span><span>{resume.personalInfo.phone}</span></>}
          {resume.personalInfo.location && <><span>•</span><span>{resume.personalInfo.location}</span></>}
        </div>
        {(resume.personalInfo.linkedIn || resume.personalInfo.github || resume.personalInfo.portfolio) && (
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-0.5" style={{ fontSize: `${fontSize * 0.88}px` }}>
            {resume.personalInfo.linkedIn && <span>{resume.personalInfo.linkedIn}</span>}
            {resume.personalInfo.github && <><span>•</span><span>{resume.personalInfo.github}</span></>}
            {resume.personalInfo.portfolio && <><span>•</span><span>{resume.personalInfo.portfolio}</span></>}
          </div>
        )}
      </header>

      {resume.summary && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Professional Summary</h2>
          <p style={{ fontSize: `${fontSize * 0.92}px`, lineHeight: 1.5 }}>{resume.summary}</p>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Education</h2>
          <div className="space-y-1.5">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <p style={{ fontSize: `${fontSize * 0.93}px` }} className="font-bold">{edu.degree} in {edu.field}</p>
                  <span style={{ fontSize: `${fontSize * 0.88}px` }} className="text-gray-600 ml-2 shrink-0">
                    {formatDate(edu.startDate)}{edu.startDate && edu.endDate ? ' – ' : ''}{formatDate(edu.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: `${fontSize * 0.9}px` }}>
                  <span className="font-semibold">{edu.institution}</span>
                  {edu.gpa && <span className="text-gray-600"> • {isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}</span>}
                </p>
                {edu.description && <p style={{ fontSize: `${fontSize * 0.88}px` }} className="text-gray-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Technical Skills</h2>
          <p style={{ fontSize: `${fontSize * 0.92}px`, lineHeight: 1.5 }}>{resume.skills.join(' • ')}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Work Experience</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p style={{ fontSize: `${fontSize * 0.93}px` }} className="font-bold">{exp.position}</p>
                  <span style={{ fontSize: `${fontSize * 0.88}px` }} className="text-gray-600 ml-2 shrink-0">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: `${fontSize * 0.9}px` }} className="mb-0.5">
                  <span className="font-semibold">{exp.company}</span>
                  {exp.location && <span className="text-gray-600"> • {exp.location}</span>}
                </p>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5" style={{ fontSize: `${fontSize * 0.9}px` }}>
                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Projects</h2>
          <div className="space-y-1.5">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <p style={{ fontSize: `${fontSize * 0.93}px` }} className="font-bold">{proj.name}</p>
                <p style={{ fontSize: `${fontSize * 0.9}px` }}>{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p style={{ fontSize: `${fontSize * 0.88}px` }}><span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}</p>
                )}
                {(proj.link || proj.github) && (
                  <p style={{ fontSize: `${fontSize * 0.88}px` }} className="text-gray-600">
                    {proj.link && <span>{proj.link}</span>}
                    {proj.link && proj.github && <span> • </span>}
                    {proj.github && <span>{proj.github}</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Certifications</h2>
          <div className="space-y-0.5">
            {resume.certifications.map((cert) => (
              <p key={cert.id} style={{ fontSize: `${fontSize * 0.9}px` }}>
                <span className="font-bold">{cert.name}</span>{' – '}{cert.issuer} ({formatDate(cert.date)})
                {cert.credentialId && <span className="text-gray-600"> • ID: {cert.credentialId}</span>}
              </p>
            ))}
          </div>
        </section>
      )}

      {resume.achievements.length > 0 && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Achievements</h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5" style={{ fontSize: `${fontSize * 0.9}px` }}>
            {resume.achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {(resume.languages?.length > 0 || resume.hobbies?.length > 0) && (
        <section className="mb-2.5">
          <h2 style={{ fontSize: `${fontSize * 0.88}px` }} className="font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Additional</h2>
          {resume.languages?.length > 0 && (
            <p style={{ fontSize: `${fontSize * 0.9}px` }}><span className="font-semibold">Languages:</span> {resume.languages.join(', ')}</p>
          )}
          {resume.hobbies?.length > 0 && (
            <p style={{ fontSize: `${fontSize * 0.9}px` }}><span className="font-semibold">Interests:</span> {resume.hobbies.join(', ')}</p>
          )}
        </section>
      )}
    </>
  );
}

function ModernTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <div className="flex" style={{ minHeight: '11in' }}>
      <div className="w-1/3 bg-gray-900 text-white p-6 space-y-4">
        <div>
          <h1 style={{ fontSize: `${fontSize * 1.6}px` }} className="font-bold uppercase leading-tight">{resume.personalInfo.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: `${fontSize * 0.9}px` }} className="text-gray-300 mt-1">{resume.personalInfo.email}</p>
          {resume.personalInfo.phone && <p style={{ fontSize: `${fontSize * 0.9}px` }} className="text-gray-300">{resume.personalInfo.phone}</p>}
          {resume.personalInfo.location && <p style={{ fontSize: `${fontSize * 0.9}px` }} className="text-gray-300">{resume.personalInfo.location}</p>}
          {resume.personalInfo.linkedIn && <p style={{ fontSize: `${fontSize * 0.9}px` }} className="text-gray-300">{resume.personalInfo.linkedIn}</p>}
          {resume.personalInfo.github && <p style={{ fontSize: `${fontSize * 0.9}px` }} className="text-gray-300">{resume.personalInfo.github}</p>}
        </div>
        {resume.skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b border-gray-500 pb-1 mb-2">Skills</h2>
            <ul className="space-y-1">{resume.skills.map((skill, i) => <li key={i} className="text-gray-300">• {skill}</li>)}</ul>
          </div>
        )}
        {resume.certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b border-gray-500 pb-1 mb-2">Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="mb-1">
                <p className="font-semibold text-white">{cert.name}</p>
                <p className="text-gray-300">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-2/3 p-6 space-y-4">
        {resume.summary && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b-2 border-gray-800 pb-1 mb-2">Summary</h2>
            <p>{resume.summary}</p>
          </section>
        )}
        {resume.experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b-2 border-gray-800 pb-1 mb-2">Experience</h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-gray-500">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p className="font-semibold text-gray-700">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.education.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b-2 border-gray-800 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between">
                    <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                    <span className="text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                  </div>
                  <p>{edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.projects.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b-2 border-gray-800 pb-1 mb-2">Projects</h2>
            <div className="space-y-2">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold">{proj.name}</h3>
                  <p>{proj.description}</p>
                  {proj.technologies.length > 0 && <p className="text-gray-600"><span className="font-semibold">Tech:</span> {proj.technologies.join(', ')}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.1}px` }} className="font-bold uppercase border-b-2 border-gray-800 pb-1 mb-2">Achievements</h2>
            <ul className="list-disc list-outside ml-4 space-y-0.5">{resume.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <>
      <header className="mb-6">
        <h1 style={{ fontSize: `${fontSize * 2}px` }} className="font-light tracking-widest mb-1">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 text-gray-500" style={{ fontSize: `${fontSize * 0.9}px` }}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedIn && <span>• {resume.personalInfo.linkedIn}</span>}
          {resume.personalInfo.github && <span>• {resume.personalInfo.github}</span>}
        </div>
      </header>
      {resume.summary && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Summary</h2>
          <p className="text-gray-700">{resume.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gray-300 pl-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <span className="text-gray-400">{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p className="text-gray-500">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700 mt-1">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Education</h2>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-300 pl-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                  <span className="text-gray-400">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
                </div>
                <p className="text-gray-500">{edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.skills.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
          <p className="text-gray-700">{resume.skills.join(' • ')}</p>
        </section>
      )}
      {resume.projects.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Projects</h2>
          <div className="space-y-2">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-gray-300 pl-3">
                <h3 className="font-semibold">{proj.name}</h3>
                <p className="text-gray-700">{proj.description}</p>
                {proj.technologies.length > 0 && <p className="text-gray-500">{proj.technologies.join(', ')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.certifications.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Certifications</h2>
          <div className="space-y-1">
            {resume.certifications.map((cert) => (
              <div key={cert.id}><span className="font-semibold">{cert.name}</span> — {cert.issuer} ({formatDate(cert.date)})</div>
            ))}
          </div>
        </section>
      )}
      {resume.achievements.length > 0 && (
        <section className="mb-5">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Achievements</h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700">{resume.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </section>
      )}
    </>
  );
}

function BoldTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <>
      <header className="bg-black text-white p-6 mb-4">
        <h1 style={{ fontSize: `${fontSize * 1.8}px` }} className="font-bold uppercase">{resume.personalInfo.fullName || 'Your Name'}</h1>
        {resume.experience.length > 0 && <p style={{ fontSize: `${fontSize}px` }} className="text-gray-300 mt-1">{resume.experience[0].position}</p>}
      </header>
      <div className="px-6">
        {resume.summary && <section className="mb-4"><p className="text-gray-700">{resume.summary}</p></section>}
        <div className="flex gap-6 mb-4">
          {resume.experience.length > 0 && (
            <div className="flex-1">
              <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Experience</h2>
              <div className="space-y-3">
                {resume.experience.map((exp) => (
                  <div key={exp.id}>
                    <p className="font-bold">{exp.company}</p>
                    <p className="text-gray-500">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    <p className="font-semibold">{exp.position}</p>
                    {exp.description.length > 0 && <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {resume.skills.length > 0 && (
            <div className="w-1/3">
              <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Skills</h2>
              <ul className="space-y-1">{resume.skills.map((skill, i) => <li key={i} className="text-gray-700">{skill}</li>)}</ul>
            </div>
          )}
        </div>
        {resume.education.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Education</h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold">{edu.degree} in {edu.field} • {edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
                  <p className="text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.projects.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Projects</h2>
            <div className="space-y-2">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <p className="font-bold">{proj.name}</p>
                  <p className="text-gray-700">{proj.description}</p>
                  {proj.technologies.length > 0 && <p className="text-gray-500">{proj.technologies.join(', ')}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {resume.certifications.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id}><span className="font-bold">{cert.name}</span> — {cert.issuer} ({formatDate(cert.date)})</div>
            ))}
          </section>
        )}
        {resume.achievements.length > 0 && (
          <section className="mb-4">
            <h2 style={{ fontSize: `${fontSize * 1.05}px` }} className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Achievements</h2>
            <ul className="list-disc list-outside ml-4 space-y-0.5">{resume.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </section>
        )}
      </div>
    </>
  );
}

function ElegantTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <div className="px-10">
      <header className="text-center mb-5 pb-4 border-b border-gray-300">
        <h1 style={{ fontSize: `${fontSize * 1.9}px` }} className="font-bold uppercase tracking-widest mb-1">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-2 text-gray-500">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <><span>•</span><span>{resume.personalInfo.phone}</span></>}
          {resume.personalInfo.location && <><span>•</span><span>{resume.personalInfo.location}</span></>}
        </div>
        {resume.experience.length > 0 && <p style={{ fontSize: `${fontSize}px` }} className="italic text-gray-500 mt-2">{resume.experience[0].position}</p>}
      </header>
      {resume.summary && <section className="mb-4 text-center"><p className="text-gray-600 italic">{resume.summary}</p></section>}
      {resume.experience.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <p className="font-bold">{exp.company}</p>
                <p className="italic text-gray-600">{exp.position} • {formatDate(exp.startDate)}–{exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                {exp.description.length > 0 && <ul className="text-left list-disc list-outside ml-8 mt-1 space-y-0.5 text-gray-700">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>}
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Education</h2>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <p className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p className="text-gray-600">{edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}{` • ${formatDate(edu.endDate)}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.skills.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Skills</h2>
          <p className="text-center text-gray-700">{resume.skills.join(' • ')}</p>
        </section>
      )}
      {resume.projects.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Projects</h2>
          <div className="space-y-2">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="text-center">
                <p className="font-bold">{proj.name}</p>
                <p className="text-gray-600">{proj.description}</p>
                {proj.technologies.length > 0 && <p className="italic text-gray-500">{proj.technologies.join(', ')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {resume.certifications.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Certifications</h2>
          {resume.certifications.map((cert) => (
            <p key={cert.id} className="text-center text-gray-700"><span className="font-semibold">{cert.name}</span> — {cert.issuer} ({formatDate(cert.date)})</p>
          ))}
        </section>
      )}
      {resume.achievements.length > 0 && (
        <section className="mb-4">
          <h2 style={{ fontSize: `${fontSize * 0.85}px` }} className="uppercase tracking-widest text-gray-400 text-center mb-3">Achievements</h2>
          <ul className="list-disc list-outside ml-8 space-y-0.5 text-gray-700">{resume.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  const initials = resume.personalInfo.fullName
    ? resume.personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'JD';
  return (
    <div className="px-8 pt-6">
      <header className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold flex-shrink-0" style={{ fontSize: `${fontSize * 1.3}px` }}>{initials}</div>
        <div>
          <h1 style={{ fontSize: `${fontSize * 1.5}px` }} className="font-bold">{resume.personalInfo.fullName || 'Your Name'}</h1>
          {resume.experience.length > 0 && <p className="text-gray-500">{resume.experience[0].position}</p>}
          <div className="flex flex-wrap gap-2 text-gray-400 mt-0.5" style={{ fontSize: `${fontSize * 0.85}px` }}>
            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
          </div>
        </div>
      </header>
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {resume.summary && <section><h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Summary</h2><p className="text-gray-700">{resume.summary}</p></section>}
          {resume.experience.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Experience</h2>
              <div className="space-y-3">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="border border-gray-200 rounded p-2">
                    <p className="font-bold">{exp.company}</p>
                    <p className="text-gray-500" style={{ fontSize: `${fontSize * 0.9}px` }}>{exp.position} • {formatDate(exp.startDate)}-{exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    {exp.description.length > 0 && <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-gray-700">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {resume.projects.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Projects</h2>
              <div className="space-y-2">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="border border-gray-200 rounded p-2">
                    <p className="font-bold">{proj.name}</p>
                    <p className="text-gray-700">{proj.description}</p>
                    {proj.technologies.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{proj.technologies.map((tech, i) => <span key={i} className="bg-gray-900 text-white px-2 py-0.5 rounded-full" style={{ fontSize: `${fontSize * 0.8}px` }}>{tech}</span>)}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {resume.achievements.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Achievements</h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700">{resume.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </section>
          )}
        </div>
        <div className="w-2/5 space-y-4">
          {resume.skills.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1">{resume.skills.map((skill, i) => <span key={i} className="bg-gray-900 text-white px-2 py-0.5 rounded-full" style={{ fontSize: `${fontSize * 0.8}px` }}>{skill}</span>)}</div>
            </section>
          )}
          {resume.education.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Education</h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="border border-gray-200 rounded p-2">
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-gray-500">{edu.institution}</p>
                    <p className="text-gray-400" style={{ fontSize: `${fontSize * 0.85}px` }}>{formatDate(edu.startDate)}-{formatDate(edu.endDate)}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {resume.certifications.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.8}px` }} className="uppercase tracking-widest text-gray-400 mb-2">Certifications</h2>
              <div className="space-y-1">
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded p-2">
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-gray-500">{cert.issuer} • {formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function PinkFloralTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <div style={{ minHeight: '11in', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, #f9a8c9 0%, #f472b6 40%, #e879a0 70%, #c2185b 100%)', height: '12px', flexShrink: 0 }} />
      <header style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fce7f3 100%)', padding: '28px 40px 20px', borderBottom: '2px solid #f9a8c9', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '-10px', right: '30px', width: '90px', height: '90px', borderRadius: '50%', background: 'radial-gradient(circle, #f9a8c9 30%, #fce7f3 80%)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '20px', right: '10px', width: '55px', height: '55px', borderRadius: '50%', background: 'radial-gradient(circle, #f472b6 30%, #fce7f3 80%)', opacity: 0.35 }} />
        <h1 style={{ fontSize: `${fontSize * 2}px`, fontWeight: 'bold', color: '#9d174d', letterSpacing: '2px', marginBottom: '4px', textTransform: 'uppercase' }}>{resume.personalInfo.fullName || 'Your Name'}</h1>
        {resume.experience.length > 0 && <p style={{ color: '#be185d', fontStyle: 'italic', fontSize: `${fontSize * 1.05}px`, marginBottom: '8px' }}>{resume.experience[0].position}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', color: '#9d174d', fontSize: `${fontSize * 0.9}px` }}>
          {resume.personalInfo.email && <span>✉ {resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>✆ {resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>⌖ {resume.personalInfo.location}</span>}
          {resume.personalInfo.linkedIn && <span>in {resume.personalInfo.linkedIn}</span>}
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: '35%', background: 'linear-gradient(180deg, #fce7f3 0%, #fff0f8 100%)', padding: '24px 20px', borderRight: '2px solid #f9a8c9' }}>
          {resume.skills.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.85}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Skills</h2>
              <div>{resume.skills.map((skill, i) => <span key={i} style={{ padding: '3px 8px', marginBottom: '4px', background: '#fbcfe8', borderRadius: '12px', color: '#9d174d', fontSize: `${fontSize * 0.88}px`, display: 'inline-block', marginRight: '4px' }}>{skill}</span>)}</div>
            </section>
          )}
          {resume.education.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.85}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 'bold', color: '#9d174d', fontSize: `${fontSize * 0.9}px` }}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p style={{ color: '#be185d', fontSize: `${fontSize * 0.85}px` }}>{edu.institution}</p>
                  <p style={{ color: '#db2777', fontSize: `${fontSize * 0.8}px` }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
                </div>
              ))}
            </section>
          )}
          {resume.certifications.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.85}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Certifications</h2>
              {resume.certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '6px' }}>
                  <p style={{ fontWeight: 'bold', color: '#9d174d', fontSize: `${fontSize * 0.88}px` }}>{cert.name}</p>
                  <p style={{ color: '#be185d', fontSize: `${fontSize * 0.82}px` }}>{cert.issuer} • {formatDate(cert.date)}</p>
                </div>
              ))}
            </section>
          )}
          {resume.languages && resume.languages.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.85}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Languages</h2>
              {resume.languages.map((lang, i) => <p key={i} style={{ color: '#9d174d', fontSize: `${fontSize * 0.88}px`, marginBottom: '3px' }}>🌸 {lang}</p>)}
            </section>
          )}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.85}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Interests</h2>
              <p style={{ color: '#9d174d', fontSize: `${fontSize * 0.88}px` }}>{resume.hobbies.join(' • ')}</p>
            </section>
          )}
        </div>
        <div style={{ flex: 1, padding: '24px 28px' }}>
          {resume.summary && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '8px' }}>About Me</h2>
              <p style={{ color: '#374151', lineHeight: '1.6', fontStyle: 'italic' }}>{resume.summary}</p>
            </section>
          )}
          {resume.experience.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Experience</h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '12px', paddingLeft: '10px', borderLeft: '3px solid #f9a8c9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 'bold', color: '#9d174d', fontSize: `${fontSize * 0.95}px` }}>{exp.position}</p>
                    <span style={{ color: '#be185d', fontSize: `${fontSize * 0.82}px` }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: '#db2777', fontSize: `${fontSize * 0.88}px`, marginBottom: '4px' }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                  {exp.description.length > 0 && <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.description.map((desc, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.9}px`, marginBottom: '2px' }}>{desc}</li>)}</ul>}
                </div>
              ))}
            </section>
          )}
          {resume.projects.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
              {resume.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #f9a8c9' }}>
                  <p style={{ fontWeight: 'bold', color: '#9d174d', fontSize: `${fontSize * 0.92}px` }}>{proj.name}</p>
                  <p style={{ color: '#374151', fontSize: `${fontSize * 0.88}px` }}>{proj.description}</p>
                  {proj.technologies.length > 0 && <p style={{ color: '#be185d', fontSize: `${fontSize * 0.83}px`, fontStyle: 'italic' }}>{proj.technologies.join(' • ')}</p>}
                </div>
              ))}
            </section>
          )}
          {resume.achievements.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', borderBottom: '1.5px solid #f9a8c9', paddingBottom: '4px', marginBottom: '8px' }}>Achievements</h2>
              <ul style={{ paddingLeft: '16px' }}>{resume.achievements.map((a, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.9}px`, marginBottom: '3px' }}>{a}</li>)}</ul>
            </section>
          )}
        </div>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #c2185b 0%, #e879a0 40%, #f472b6 70%, #f9a8c9 100%)', height: '10px', flexShrink: 0 }} />
    </div>
  );
}

function CubistTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  const initials = resume.personalInfo.fullName ? resume.personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'YN';
  return (
    <div style={{ display: 'flex', minHeight: '11in', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '32%', background: '#2d6a4f', color: 'white', padding: '32px 20px' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '8px', background: '#52b788', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: `${fontSize * 1.8}px`, fontWeight: 'bold', color: 'white', border: '3px solid #74c69d' }}>{initials}</div>
        <h1 style={{ fontSize: `${fontSize * 1.3}px`, fontWeight: 'bold', textAlign: 'center', marginBottom: '4px', color: 'white' }}>{resume.personalInfo.fullName || 'NAME HERE'}</h1>
        {resume.experience.length > 0 && <p style={{ textAlign: 'center', color: '#b7e4c7', fontSize: `${fontSize * 0.88}px`, marginBottom: '20px' }}>{resume.experience[0].position}</p>}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#74c69d', borderBottom: '1px solid #52b788', paddingBottom: '4px', marginBottom: '8px' }}>Contact</h2>
          {resume.personalInfo.email && <p style={{ fontSize: `${fontSize * 0.82}px`, color: '#d8f3dc', marginBottom: '4px' }}>✉ {resume.personalInfo.email}</p>}
          {resume.personalInfo.phone && <p style={{ fontSize: `${fontSize * 0.82}px`, color: '#d8f3dc', marginBottom: '4px' }}>✆ {resume.personalInfo.phone}</p>}
          {resume.personalInfo.location && <p style={{ fontSize: `${fontSize * 0.82}px`, color: '#d8f3dc', marginBottom: '4px' }}>⌖ {resume.personalInfo.location}</p>}
          {resume.personalInfo.linkedIn && <p style={{ fontSize: `${fontSize * 0.82}px`, color: '#d8f3dc', marginBottom: '4px' }}>in {resume.personalInfo.linkedIn}</p>}
        </div>
        {resume.skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#74c69d', borderBottom: '1px solid #52b788', paddingBottom: '4px', marginBottom: '8px' }}>Skills</h2>
            {resume.skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: '5px' }}>
                <p style={{ fontSize: `${fontSize * 0.85}px`, color: '#d8f3dc', marginBottom: '2px' }}>{skill}</p>
                <div style={{ background: '#1b4332', borderRadius: '4px', height: '5px' }}><div style={{ background: '#74c69d', borderRadius: '4px', height: '5px', width: `${70 + (i % 3) * 10}%` }} /></div>
              </div>
            ))}
          </div>
        )}
        {resume.languages && resume.languages.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#74c69d', borderBottom: '1px solid #52b788', paddingBottom: '4px', marginBottom: '8px' }}>Languages</h2>
            {resume.languages.map((lang, i) => <p key={i} style={{ fontSize: `${fontSize * 0.85}px`, color: '#d8f3dc', marginBottom: '3px' }}>• {lang}</p>)}
          </div>
        )}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <div>
            <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#74c69d', borderBottom: '1px solid #52b788', paddingBottom: '4px', marginBottom: '8px' }}>Interests</h2>
            <p style={{ fontSize: `${fontSize * 0.85}px`, color: '#d8f3dc' }}>{resume.hobbies.join(' • ')}</p>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '32px 28px', background: 'white' }}>
        {resume.summary && <section style={{ marginBottom: '20px' }}><h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '8px' }}>Profile</h2><p style={{ color: '#374151', lineHeight: '1.6', fontSize: `${fontSize * 0.93}px` }}>{resume.summary}</p></section>}
        {resume.education.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #74c69d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 'bold', color: '#1b4332', fontSize: `${fontSize * 0.93}px` }}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.82}px` }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
                <p style={{ color: '#2d6a4f', fontSize: `${fontSize * 0.88}px` }}>{edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
              </div>
            ))}
          </section>
        )}
        {resume.experience.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '10px' }}>Work Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '12px', paddingLeft: '10px', borderLeft: '3px solid #74c69d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 'bold', color: '#1b4332', fontSize: `${fontSize * 0.95}px` }}>{exp.position}</p>
                  <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.82}px` }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p style={{ color: '#2d6a4f', fontSize: `${fontSize * 0.88}px`, marginBottom: '4px' }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                {exp.description.length > 0 && <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.description.map((desc, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.88}px`, marginBottom: '2px' }}>{desc}</li>)}</ul>}
              </div>
            ))}
          </section>
        )}
        {resume.projects.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '3px solid #74c69d' }}>
                <p style={{ fontWeight: 'bold', color: '#1b4332', fontSize: `${fontSize * 0.92}px` }}>{proj.name}</p>
                <p style={{ color: '#374151', fontSize: `${fontSize * 0.88}px` }}>{proj.description}</p>
                {proj.technologies.length > 0 && <p style={{ color: '#2d6a4f', fontSize: `${fontSize * 0.83}px`, fontStyle: 'italic' }}>{proj.technologies.join(' • ')}</p>}
              </div>
            ))}
          </section>
        )}
        {resume.certifications.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '10px' }}>Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: '#1b4332', fontSize: `${fontSize * 0.9}px` }}>{cert.name}</span>
                <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.85}px` }}> — {cert.issuer} ({formatDate(cert.date)})</span>
              </div>
            ))}
          </section>
        )}
        {resume.achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d6a4f', borderBottom: '2px solid #2d6a4f', paddingBottom: '4px', marginBottom: '8px' }}>Achievements</h2>
            <ul style={{ paddingLeft: '16px' }}>{resume.achievements.map((a, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.9}px`, marginBottom: '3px' }}>{a}</li>)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}

function PlayfulTemplate({ resume, fontSize }: { resume: ResumeData; fontSize: number }) {
  return (
    <div style={{ display: 'flex', minHeight: '11in', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '33%', background: '#1e2d4a', color: 'white', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: '#f7c59f', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '60px', right: '-30px', width: '80px', height: '80px', borderRadius: '50%', background: '#a8d8ea', opacity: 0.4 }} />
        <div style={{ position: 'absolute', bottom: '100px', left: '-15px', width: '70px', height: '70px', borderRadius: '50%', background: '#f7a8c4', opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: `${fontSize * 1.4}px`, fontWeight: 'bold', color: 'white', marginBottom: '2px', lineHeight: 1.2 }}>{resume.personalInfo.fullName ? resume.personalInfo.fullName.split(' ')[0] : '[FIRST NAME]'}</h1>
          <h1 style={{ fontSize: `${fontSize * 1.4}px`, fontWeight: 'bold', color: '#a8d8ea', marginBottom: '16px', lineHeight: 1.2 }}>{resume.personalInfo.fullName ? resume.personalInfo.fullName.split(' ').slice(1).join(' ') : '[SURNAME]'}</h1>
          <div style={{ marginBottom: '24px' }}>
            {resume.personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ background: '#f7c59f', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#1e2d4a', flexShrink: 0 }}>⌖</span><span style={{ fontSize: `${fontSize * 0.82}px`, color: '#cbd5e1' }}>{resume.personalInfo.location}</span></div>}
            {resume.personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ background: '#a8d8ea', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#1e2d4a', flexShrink: 0 }}>✆</span><span style={{ fontSize: `${fontSize * 0.82}px`, color: '#cbd5e1' }}>{resume.personalInfo.phone}</span></div>}
            {resume.personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ background: '#f7a8c4', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#1e2d4a', flexShrink: 0 }}>✉</span><span style={{ fontSize: `${fontSize * 0.82}px`, color: '#cbd5e1' }}>{resume.personalInfo.email}</span></div>}
            {resume.personalInfo.linkedIn && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><span style={{ background: '#a8d8ea', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#1e2d4a', flexShrink: 0 }}>in</span><span style={{ fontSize: `${fontSize * 0.82}px`, color: '#cbd5e1' }}>{resume.personalInfo.linkedIn}</span></div>}
          </div>
          {resume.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#f7c59f', marginBottom: '10px' }}>Skills</h2>
              {resume.skills.map((skill, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: `${fontSize * 0.85}px`, color: '#e2e8f0', marginBottom: '2px' }}>{skill}</p>
                  <div style={{ background: '#2d3f5e', borderRadius: '10px', height: '4px' }}><div style={{ background: ['#f7c59f', '#a8d8ea', '#f7a8c4'][i % 3], borderRadius: '10px', height: '4px', width: `${65 + (i % 4) * 8}%` }} /></div>
                </div>
              ))}
            </div>
          )}
          {resume.languages && resume.languages.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#f7c59f', marginBottom: '10px' }}>Languages</h2>
              {resume.languages.map((lang, i) => <p key={i} style={{ fontSize: `${fontSize * 0.85}px`, color: '#e2e8f0', marginBottom: '4px' }}>• {lang}</p>)}
            </div>
          )}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <div>
              <h2 style={{ fontSize: `${fontSize * 0.8}px`, textTransform: 'uppercase', letterSpacing: '2px', color: '#f7c59f', marginBottom: '10px' }}>Interests</h2>
              <p style={{ fontSize: `${fontSize * 0.85}px`, color: '#e2e8f0' }}>{resume.hobbies.join(' • ')}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, padding: '40px 28px', background: '#f8f9fa' }}>
        {resume.summary && <section style={{ marginBottom: '20px' }}><h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #a8d8ea', paddingBottom: '4px', marginBottom: '8px' }}>About Me</h2><p style={{ color: '#374151', lineHeight: '1.7', fontSize: `${fontSize * 0.92}px` }}>{resume.summary}</p></section>}
        {resume.experience.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #f7c59f', paddingBottom: '4px', marginBottom: '10px' }}>Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid #f7c59f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 'bold', color: '#1e2d4a', fontSize: `${fontSize * 0.95}px` }}>{exp.position}</p>
                  <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.82}px` }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p style={{ color: '#4b6cb7', fontSize: `${fontSize * 0.88}px`, marginBottom: '4px' }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                {exp.description.length > 0 && <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.description.map((desc, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.88}px`, marginBottom: '2px' }}>{desc}</li>)}</ul>}
              </div>
            ))}
          </section>
        )}
        {resume.education.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #f7a8c4', paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '3px solid #f7a8c4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 'bold', color: '#1e2d4a', fontSize: `${fontSize * 0.93}px` }}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.82}px` }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
                <p style={{ color: '#4b6cb7', fontSize: `${fontSize * 0.88}px` }}>{edu.institution}{edu.gpa && ` • ${isSchoolLevel(edu.degree) ? `${edu.gpa}%` : `CGPA: ${edu.gpa}/10`}`}</p>
              </div>
            ))}
          </section>
        )}
        {resume.projects.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #a8d8ea', paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '8px', paddingLeft: '12px', borderLeft: '3px solid #a8d8ea' }}>
                <p style={{ fontWeight: 'bold', color: '#1e2d4a', fontSize: `${fontSize * 0.92}px` }}>{proj.name}</p>
                <p style={{ color: '#374151', fontSize: `${fontSize * 0.88}px` }}>{proj.description}</p>
                {proj.technologies.length > 0 && <p style={{ color: '#4b6cb7', fontSize: `${fontSize * 0.83}px`, fontStyle: 'italic' }}>{proj.technologies.join(' • ')}</p>}
              </div>
            ))}
          </section>
        )}
        {resume.certifications.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #f7c59f', paddingBottom: '4px', marginBottom: '10px' }}>Certifications</h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', color: '#1e2d4a', fontSize: `${fontSize * 0.9}px` }}>{cert.name}</span>
                <span style={{ color: '#6b7280', fontSize: `${fontSize * 0.85}px` }}> — {cert.issuer} ({formatDate(cert.date)})</span>
              </div>
            ))}
          </section>
        )}
        {resume.achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: `${fontSize * 1.0}px`, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e2d4a', borderBottom: '2px solid #f7a8c4', paddingBottom: '4px', marginBottom: '8px' }}>Achievements</h2>
            <ul style={{ paddingLeft: '16px' }}>{resume.achievements.map((a, i) => <li key={i} style={{ color: '#374151', fontSize: `${fontSize * 0.9}px`, marginBottom: '3px' }}>{a}</li>)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Determine if template is a full-page sidebar layout ─────────────────────
const FULL_PAGE_TEMPLATES = ['modern', 'pinkfloral', 'cubist', 'playful'];
const NO_PADDING_TEMPLATES = ['modern', 'pinkfloral', 'cubist', 'playful'];

export default function ResumePreview({ resume, template = 'classic' }: ResumePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(13);

  useEffect(() => {
    const adjustFontSize = () => {
      const el = contentRef.current;
      if (!el) return;

      // Only shrink font if content overflows — never upscale for Classic/Minimal/etc.
      const pageHeight = 11 * 96;
      const minSize = 7;
      let size = 13;
      el.style.fontSize = `${size}px`;
      void el.offsetHeight;

      while (el.scrollHeight > pageHeight && size > minSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
        void el.offsetHeight;
      }

      setFontSize(size);
    };

    requestAnimationFrame(() => requestAnimationFrame(adjustFontSize));
  }, [resume, template]);

  const renderTemplate = () => {
    switch (template) {
      case 'modern':     return <ModernTemplate resume={resume} fontSize={fontSize} />;
      case 'minimal':    return <MinimalTemplate resume={resume} fontSize={fontSize} />;
      case 'bold':       return <BoldTemplate resume={resume} fontSize={fontSize} />;
      case 'elegant':    return <ElegantTemplate resume={resume} fontSize={fontSize} />;
      case 'creative':   return <CreativeTemplate resume={resume} fontSize={fontSize} />;
      case 'pinkfloral': return <PinkFloralTemplate resume={resume} fontSize={fontSize} />;
      case 'cubist':     return <CubistTemplate resume={resume} fontSize={fontSize} />;
      case 'playful':    return <PlayfulTemplate resume={resume} fontSize={fontSize} />;
      default:           return <ClassicTemplate resume={resume} fontSize={fontSize} />;
    }
  };

  const isFullPage  = FULL_PAGE_TEMPLATES.includes(template);
  const noPadding   = NO_PADDING_TEMPLATES.includes(template);

  return (
    <div
      className="bg-white mx-auto shadow-lg print:shadow-none resume-preview"
      style={{
        width: '8.5in',
        // Full-page sidebar templates always fill the page; others shrink to content
        minHeight: '11in',
        height: isFullPage ? '11in' : 'auto',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: isFullPage ? 'hidden' : 'visible',
      }}
    >
      <div
        ref={contentRef}
        className={noPadding ? '' : 'p-10 print:p-10'}
        style={{ fontSize: `${fontSize}px`, boxSizing: 'border-box' }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}