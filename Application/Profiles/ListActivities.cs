using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDTO>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(x => x.AppUser.UserName == request.Username)
                    .ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                if (request.Predicate == "past")
                {
                    query = query.Where(d => d.Date < DateTime.UtcNow)
                        .OrderByDescending(d => d.Date);
                }
                if (request.Predicate == "future")
                {
                    query = query.Where(d => d.Date >= DateTime.UtcNow)
                        .OrderBy(d => d.Date);
                }
                if (request.Predicate == "hosting")
                {
                    query = query.Where(x => x.HostUsername == request.Username)
                        .OrderBy(d => d.Date);
                }

                return Result<List<UserActivityDTO>>.Success(
                    await query.ToListAsync()
                );
            }
        }
    }
}