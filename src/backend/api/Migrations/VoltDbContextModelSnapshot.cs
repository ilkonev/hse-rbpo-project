using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Api.Data;

#nullable disable

namespace Api.Migrations;

[DbContext(typeof(VoltDbContext))]
partial class VoltDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
        modelBuilder.HasAnnotation("ProductVersion", "8.0.11");
        modelBuilder.HasAnnotation("Relational:MaxIdentifierLength", 63);
        modelBuilder.Entity("Api.Data.Entities.User", entity =>
        {
            entity.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            entity.Property<DateTimeOffset>("CreatedAt").HasColumnType("timestamp with time zone");
            entity.Property<string>("DisplayName").IsRequired().HasMaxLength(80).HasColumnType("character varying(80)");
            entity.Property<string>("Email").IsRequired().HasMaxLength(320).HasColumnType("character varying(320)");
            entity.Property<string>("PasswordHash").IsRequired().HasColumnType("text");
            entity.HasKey("Id");
            entity.HasIndex("Email").IsUnique();
            entity.ToTable("users");
        });
    }
}
