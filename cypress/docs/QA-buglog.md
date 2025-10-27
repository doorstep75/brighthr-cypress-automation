# QA Bug / Query Log

> Purpose: a lightweight, versioned list of issues spotted during exploratory and automation test authoring
> Accepted that sandbox envs may not include full UX/customer experience
> Accepted that many/all of these may have been previously discussed and considered and outcomes already set up or accepted
> Outcome of discussions would determine if bugs or stories with further detail would be written up
> I was more just trying to demonstrate my observational skills 😊

## Summary

- 001: first and last name accepts a single value (by design?)
- 002: integers are accepted in first and last name fields
- 003: phone number field accepts any data value and combinations
- 004: phone number field has no apparent upper bound length
- 005: phone number UX improvements with regex?
- 006: email regex is lenient (allows /xxx@xxx.o/)
- 007: duplicate names allowed/not flagged on employees list
- 008: duplicate emails allowed/not flagged on employees list
- note: accepted that 007 & 008 can occur in real world scenarios
- 009: job title has no apparent upper bound length
- 010: various fields (incl mandatories) accept whitespace during input (trimmed on save)
- 011: UX addition for titles (Mr/Ms/etc.)
- 012: Hover state on icons requires dependencies for automation and consideration for automation value on its inclusion
