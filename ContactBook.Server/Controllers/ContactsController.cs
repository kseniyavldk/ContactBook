using ContactBook.Server.Data;
using ContactBook.Server.DTOs;
using ContactBook.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactBook.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContactsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contact>>> GetAll()
    {
        var contacts = await _db.Contacts
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Contact>> GetById(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);

        if (contact is null)
            return NotFound();

        return Ok(contact);
    }

    [HttpPost]
    public async Task<ActionResult<Contact>> Create(ContactDto dto)
    {
        var contact = new Contact
        {
            Name = dto.Name.Trim(),
            MobilePhone = dto.MobilePhone.Trim(),
            JobTitle = dto.JobTitle?.Trim(),
            BirthDate = dto.BirthDate
        };

        _db.Contacts.Add(contact);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Contact>> Update(int id, ContactDto dto)
    {
        var contact = await _db.Contacts.FindAsync(id);

        if (contact is null)
            return NotFound();

        contact.Name = dto.Name.Trim();
        contact.MobilePhone = dto.MobilePhone.Trim();
        contact.JobTitle = dto.JobTitle?.Trim();
        contact.BirthDate = dto.BirthDate;

        await _db.SaveChangesAsync();

        return Ok(contact);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);

        if (contact is null)
            return NotFound();

        _db.Contacts.Remove(contact);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}